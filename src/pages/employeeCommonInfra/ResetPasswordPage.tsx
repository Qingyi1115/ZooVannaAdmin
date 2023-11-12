import ResetPasswordForm from "../../components/EmployeeCommonInfra/ResetPasswordForm";
function ResetPasswordPage() {
  return (
    <div className="pt-40 ">
      <div className="mb-10 ml-35 flex flex-col gap-1 text-3xl font-bold">
        Reset Password
      </div>
      <ResetPasswordForm />
    </div>
  );
}

export default ResetPasswordPage;
