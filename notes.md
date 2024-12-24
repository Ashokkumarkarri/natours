# 017 Factory Functions\_ Reading

- Create factories for getting documents.
- Start with `getOne` function.
- Export `getOne`. It’s trickier because of `populate` in the `getTour` handler.
- Look at the `populate` in the `getTour` handler.
  - It’s different from other `get` handlers in resources.
- Allow passing a `populate` options object into `getOne`.

---

- Instead of just passing the model, include options:
  - `populate` options.
- Return the normal handler function.
- Copy the necessary logic, adjust:
  - Use `model` for querying.
  - Rename variables, e.g., `doc` -> `document`.

---

- Adjust logic for `populate`:
  - Create the query first.
  - If `populate` options exist, add them to the query.
  - Await the final query.

---

- Implementation:
  - Query = `Model.findById`.
  - If `populate` options exist:
    - Query becomes `query.populate(populate options)`.
  - Await the query and save to a document.

---

- Use this approach in `getTour`:
  - Replace existing `getTour` logic with `factory.getOne`.
  - Pass `Tour` model and `populate` options.
  - Define `path` for `reviews`.

---

- Test `getTour`:
  - Fetch a specific tour.
  - Check if `reviews` population works.

---

- Apply `getOne` to other resources:
  - Example: In `userController`, use `factory.getOne` with `userModel`.
  - No `populate` options for users.

---

- Update error message for `createUser`:
  - "This route is not defined, use signup instead."
