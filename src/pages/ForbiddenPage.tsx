const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-600">
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default ForbiddenPage;
