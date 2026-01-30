import Login from "@/components/Login";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-6 sm:mb-8 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Intake Review System
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Secure document intake and review platform
        </p>
      </div>

      <Login />

      <div className="mt-6 sm:mt-8 text-center w-full max-w-md">
        <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
        <div className="text-xs text-gray-600 space-y-1 flex flex-col sm:block">
          <p>
            <span className="font-medium">Client:</span> patient@demo.com / password
          </p>
          <p>
            <span className="font-medium">Reviewer:</span> reviewer@demo.com / password
          </p>
          <p>
            <span className="font-medium">Reviewer 2:</span> reviewer2@demo.com / password
          </p>
        </div>
      </div>
    </div>
  );
}
