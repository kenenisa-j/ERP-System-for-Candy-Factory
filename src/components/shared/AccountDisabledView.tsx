export default function AccountDisabledView() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-gray-900">Account Disabled</h2>
        <p className="text-gray-500 mt-2">
          Your account is currently disabled. Please contact your administrator to regain access.
        </p>
      </div>
    </div>
  );
}