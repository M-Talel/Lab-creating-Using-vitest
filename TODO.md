# TODO - Banking app + Vitest suite

## Step 1: Setup

- Install/configure Vitest + React Testing Library + jsdom + user-event
- Add vitest script + config

## Step 2: Implement Banking App (to be tested)

- Create `src/transactions` module (API + state helpers)
- Implement UI:
  - Transactions table/list shown on startup (from API)
  - Add transaction form (amount, description, date/category if needed)
  - Search input (updates results)
  - Sorting controls (e.g., newest/oldest)

## Step 3: Add/Iterate Tests

- `Display Transactions` suite
  - shows transactions on startup
- `Add transactions` suite
  - new transaction appears on frontend
  - POST request called
- `Search & sort` suite
  - search filters results
  - sorting changes order
- `Search incomplete` suite
  - add remaining search behavior to satisfy tests

## Step 4: Quality

- Add comments explaining logic/purpose
- Remove unused/commented code
- Ensure sensitive data not committed

## Step 5: README + Screenshots

- Update README with app functionality description
- Add screenshot of completed work in README

## Step 6: GitHub workflow

- Create feature branch `blackboxai/testing-banking-transactions`
- Commit changes with clear messages
- Push branch
- Open PR
- Merge to main
- Delete stale branches

## Step 7: Final verification

- Run `npm test` and ensure all tests pass
