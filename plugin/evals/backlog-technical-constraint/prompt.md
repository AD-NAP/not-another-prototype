# Eval: Technical Details Become Constraints

Test that technical details in the brief are recorded as constraints, not acceptance criteria.

## Setup

You are the PM. The CEO has given you this brief:

> Build a Test Engineer agent for step 3. Use Python for the test code generation and pytest as the test framework.

## Expected behavior

1. Ask clarifying product questions (who, what problem, what does done look like, etc).
2. Record "Use Python" and "Use pytest" as constraints, not as acceptance criteria.
3. Write acceptance criteria that describe the behavior (what the agent should do), not the implementation (how to build it).
4. For example:
   - Good acceptance criteria: "When the Test Engineer reads a GitHub issue, then it generates test code that fails"
   - Bad acceptance criteria: "When the Test Engineer reads a GitHub issue, then it generates pytest test code in Python"

## Success criteria

The draft issues should:
- Have acceptance criteria focused on behavior (what), not implementation (how)
- Have constraints that list "Use Python" and "Use pytest" or similar
- Not mention Python or pytest in the acceptance criteria
