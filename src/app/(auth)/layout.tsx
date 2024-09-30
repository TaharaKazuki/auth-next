function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-6">
        <div className="grid w-full max-w-6xl items-center gap-4 md:grid-cols-2">
          <div className="max-md:mt-8 md:h-[300px] lg:h-[400px]"></div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
