// Diagnostic file - disabled (Supabase removed)
// This file was used for debugging Supabase auth and RLS issues
// TODO: Re-implement diagnostics when backend is integrated

console.log('%c=== LOCAL MODE (No Backend) ===', 'color: #f59e0b; font-size: 16px; font-weight: bold');
console.log('Running in local-only mode. All data is stored in localStorage.');

// Export diagnostic function
export function runDiagnostic() {
  console.log('\n%c=== DIAGNOSTIC (Local Mode) ===', 'color: #10b981; font-weight: bold');
  console.log('✅ Running in local-only mode');
  console.log('✅ No backend or authentication required');
  console.log('✅ All data stored in browser localStorage');
  console.log('\nLocalStorage keys in use:');
  console.log('  - mindpex_chat_messages');
  console.log('  - mindpex_current_session');
  console.log('  - mindpex_user_settings');
  console.log('  - mindpex_emotional_memory');
  console.log('  - mindpex_sentiment_records');
  console.log('  - user_display_name');
  console.log('\n%c=== DIAGNOSTIC COMPLETE ===', 'color: #f59e0b; font-weight: bold');
}

// Expose to window for console testing
(window as any).runDiagnostic = runDiagnostic;

// Run diagnostic on load
runDiagnostic();

// Run diagnostic on load
runDiagnostic();

console.log('\n%cRun window.runDiagnostic() to re-run diagnostic', 'color: #3b82f6');
