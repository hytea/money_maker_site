# Authentication Tests

This directory contains Playwright tests for Firebase authentication flows.

## Test Coverage

- ✅ Protected routes redirect to login
- ✅ Login page displays correctly
- ✅ Public routes remain accessible
- ✅ Admin console access control
- ✅ Navigation links properly removed

## Running Tests

### Basic Test Run (Will Fail Without Firebase)

```bash
npm test -- tests/auth/login.spec.ts
```

**Note**: These tests will fail without proper Firebase configuration because the app requires Firebase to initialize.

### Running Tests with Firebase Emulator (Recommended)

To run these tests successfully, you need to set up Firebase emulator:

1. **Install Firebase Tools**:
   ```bash
   npm install -D firebase-tools
   ```

2. **Initialize Firebase Emulator**:
   ```bash
   npx firebase init emulators
   ```
   - Select "Authentication Emulator"
   - Use default ports

3. **Update Firebase Config for Testing**:
   Create `.env.test` with emulator settings:
   ```bash
   VITE_FIREBASE_API_KEY=test-api-key
   VITE_FIREBASE_AUTH_DOMAIN=localhost
   VITE_FIREBASE_PROJECT_ID=test-project
   VITE_FIREBASE_STORAGE_BUCKET=test-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:test
   ```

4. **Start Emulator and Run Tests**:
   ```bash
   npx firebase emulators:start --only auth
   npm test -- tests/auth/login.spec.ts
   ```

## Test Scenarios

### Implemented Tests

1. **Unauthenticated Access Control**
   - `/admin` redirects to `/login`
   - `/admin/analytics` redirects to `/login`

2. **Login Page**
   - Displays correct UI elements
   - Shows Google sign-in button
   - Shows admin-only warning

3. **Public Access**
   - Home page accessible
   - Calculator pages accessible
   - About page accessible

4. **Navigation**
   - Analytics link removed from public nav
   - Old analytics route handled properly

### Tests Requiring Firebase Emulator

The following tests are skipped until Firebase emulator is configured:

- Successful Google sign-in flow
- Authenticated user accessing admin console
- Logout functionality
- Post-logout access control

## Future Improvements

1. **Set up Firebase Emulator** for full authentication flow testing
2. **Add mock Firebase responses** for unit testing
3. **Test error scenarios**: Network failures, auth errors
4. **Test loading states**: Verify spinners and transitions
5. **Add visual regression tests** for login UI

## CI/CD Integration

To run these tests in CI:

1. Set up Firebase emulator in CI environment
2. Use test environment variables
3. Run tests against emulator
4. Consider using GitHub Actions with Firebase emulator

Example GitHub Actions workflow:

```yaml
- name: Install Firebase Emulator
  run: npm install -g firebase-tools

- name: Start Firebase Emulator
  run: firebase emulators:start --only auth &

- name: Run Auth Tests
  run: npm test -- tests/auth
```

## Troubleshooting

**Tests timing out**: Firebase isn't configured. Set up emulator or add real Firebase credentials.

**App crashes during tests**: Firebase initialization error. Check `.env` file has all required fields.

**Redirects not working**: Check that `AuthProvider` is properly wrapping the app in `App.tsx`.
