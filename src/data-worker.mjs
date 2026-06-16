import { createResultEnvelope } from "./data-contracts.mjs";

function createJobId() {
  return `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export class DataCloudWorker {
  constructor({ toolRegistry } = {}) {
    if (!toolRegistry) throw new Error("DataCloudWorker requires a toolRegistry.");
    this.toolRegistry = toolRegistry;
    this.jobs = new Map();
  }

  enqueue(type, input) {
    const now = new Date().toISOString();
    const job = {
      id: createJobId(),
      type,
      input,
      status: "queued",
      attempts: 0,
      createdAt: now,
      updatedAt: now,
      result: null,
      error: null,
    };
    this.jobs.set(job.id, job);
    return structuredClone(job);
  }

  getJob(id) {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Unknown worker job: ${id}`);
    return structuredClone(job);
  }

  async runNext() {
    const job = [...this.jobs.values()].find((entry) => entry.status === "queued");
    if (!job) return null;
    return this.runJob(job.id);
  }

  async drain() {
    const completed = [];
    while ([...this.jobs.values()].some((job) => job.status === "queued")) {
      completed.push(await this.runNext());
    }
    return completed;
  }

  async runJob(id) {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Unknown worker job: ${id}`);
    if (job.status !== "queued") return structuredClone(job);

    job.status = "running";
    job.attempts += 1;
    job.updatedAt = new Date().toISOString();

    try {
      job.result = await this.execute(job.type, job.input);
      job.status = job.result.ok ? "succeeded" : "failed";
      job.error = job.result.ok ? null : job.result.errors.join(" ");
    } catch (error) {
      job.status = "failed";
      job.error = error.message;
      job.result = createResultEnvelope({
        ok: false,
        kind: "worker_job",
        errors: [error.message],
        meta: { jobType: job.type },
      });
    }

    job.updatedAt = new Date().toISOString();
    return structuredClone(job);
  }

  async execute(type, input) {
    if (type === "validate_sql") {
      return this.toolRegistry.executeTool("validate_sql", input);
    }

    if (type === "query_dataset") {
      return this.toolRegistry.executeTool("query_dataset", input);
    }

    if (type === "generate_sample_code") {
      return this.toolRegistry.executeTool("generate_sample_code", input);
    }

    return createResultEnvelope({
      ok: false,
      kind: "worker_job",
      errors: [`Unknown worker job type: ${type}.`],
      meta: { jobType: type },
    });
  }
}
