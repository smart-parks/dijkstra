import { PriorityQueue } from "../libs/PriorityQueue";

describe("PriorityQueue", () => {
  describe("#sort()", () => {
    it("sorts by having the smallest first", () => {
      const queue = new PriorityQueue();
      queue.queue = [{ priority: 10 }, { priority: 1 }];

      queue.sort();

      expect(queue.queue[0].priority).toEqual(1);
    });
  });

  describe("#set()", () => {
    it("only accept numbers as priority values", () => {
      const queue = new PriorityQueue();

      expect(queue.set.bind(queue, "key", {})).toThrow(TypeError, /number/);
    });

    it("adds an unexisting key to the queue and reorders it", () => {
      const queue = new PriorityQueue();

      queue.set("ok", 1);

      expect(queue.keys.size).toEqual(1);
      expect(queue.queue).toHaveLength(1);
      expect(queue.queue[0].key).toEqual("ok");
      expect(queue.queue[0].priority).toEqual(1);
    });

    it("updates the value of an existing key", () => {
      const queue = new PriorityQueue();

      queue.set("ok", 1);
      queue.set("ok", 5);

      expect(queue.keys.size).toEqual(1);
      expect(queue.queue).toHaveLength(1);
      expect(queue.queue[0].key).toEqual("ok");
      expect(queue.queue[0].priority).toEqual(5);
    });
  });

  describe("#next()", () => {
    it("removes the first element in the queue", () => {
      const queue = new PriorityQueue();
      queue.set("ok", 10);
      queue.set("not-ok", 1);

      queue.next();

      expect(queue.queue).toHaveLength(1);
      expect(queue.keys.size).toEqual(1);
    });

    it("return the first element in the queue", () => {
      const queue = new PriorityQueue();
      queue.set("ok", 10);
      queue.set("not-ok", 1);

      const el = queue.next();

      expect(el.priority).toEqual(1);
      expect(el.key).toEqual("not-ok");
    });
  });

  describe("#isEmpty()", () => {
    it("returns false when there are elements in the queue", () => {
      const queue = new PriorityQueue();
      queue.set("ok", 3);

      expect(queue.isEmpty()).toEqual(false);
    });

    it("returns true when the queue is empty", () => {
      const queue = new PriorityQueue();

      expect(queue.isEmpty()).toEqual(true);
    });
  });

  describe("#has()", () => {
    it("returns false when the key does not exist", () => {
      const queue = new PriorityQueue();
      queue.set("not-ok", 3);

      expect(queue.has("ok")).toEqual(false);
    });

    it("returns false when the key does not exist", () => {
      const queue = new PriorityQueue();
      queue.set("not-ok", 3);

      expect(queue.has("ok")).toEqual(false);
    });
  });

  describe("#get()", () => {
    it("gets the entry with the provided key", () => {
      const queue = new PriorityQueue();
      queue.set("ok", 3);

      const res = queue.get("ok");

      expect(Object.keys(res)).toEqual(["key", "priority"]);
      expect(res.key).toEqual("ok");
      expect(res.priority).toEqual(3);
    });
  });
});
