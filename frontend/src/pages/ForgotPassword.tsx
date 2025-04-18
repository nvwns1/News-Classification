import { ChangeEvent, FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabComponent from "../components/TabComponent";
import PasswordSVG from "../assets/svg/PasswordSVG";
import EyeIcon, { EyeCrossIcon } from "../assets/svg/EyeIconSVG";
import { useEventHandler } from "../hooks/useEventHandler";
import { useAuth } from "@/hooks/useAuth";

const Forgot = () => {
  const tabs = ["Forgot Password"];

  const [activeIndex, setActiveIndex] = useState(tabs[0]);
  const handleTabChange = (tab: string) => {
    setActiveIndex(tab);
  };

  return (
    <div
      className="h-full hero"
      style={{
        backgroundImage: "url(/heroImage.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome there</h1>
          <p className="mb-5">
            {" "}
            Discover a world of possibilities with our platform.
          </p>

          <TabComponent
            tabs={tabs}
            activeTab={activeIndex}
            onTabChange={handleTabChange}
          />

          <div className="p-4">
            {activeIndex === "Forgot Password" && <ForgotPasswordComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordComponent = () => {
  const [passwordVisible, setPasswordVisible] = useState({
    password: true,
    confirmPassword: true,
  });

  const handlePasswordVisibility = (target, value) => {
    setPasswordVisible((prev) => {
      return { ...prev, [target]: value };
    });
  };

  const [data, setData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const { handleSuccess, handleError } = useEventHandler();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const { forgotPasswordMutate, forgotPasswordPending } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    if (forgotPasswordPending) return;
    e.preventDefault();

    try {
      if (!data.token) {
        throw new Error("OTP Code is required");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (data.token.length !== 6) {
        throw new Error("OTP Code must be 6 digits");
      }

      forgotPasswordMutate(
        { email, token: data.token, password: data.password },
        {
          onSuccess: (response) => {
            if (response.message === "success") {
              handleSuccess("Successfully changed the password");
              navigate("/");
            }
          },
          onError: (error) => {
            handleError(error);
          },
        }
      );
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 text-black">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="number"
            className="grow"
            placeholder="6 digit Code"
            name="token"
            maxLength={6}
            onChange={(e) => handleChange(e)}
            value={data.token}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <PasswordSVG />
          <input
            type={passwordVisible.password ? "password" : "text"}
            name="password"
            className="grow"
            placeholder="password"
            onChange={(e) => handleChange(e)}
            value={data.password}
          />
          <div
            className="hover:cursor-pointer"
            onClick={() =>
              handlePasswordVisibility("password", !passwordVisible.password)
            }
          >
            {passwordVisible.password ? <EyeCrossIcon /> : <EyeIcon />}
          </div>
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <PasswordSVG />
          <input
            type={passwordVisible.confirmPassword ? "password" : "text"}
            name="confirmPassword"
            className="grow"
            placeholder="Confirm Password"
            onChange={(e) => handleChange(e)}
            value={data.confirmPassword}
          />
          <div
            className="hover:cursor-pointer"
            onClick={() =>
              handlePasswordVisibility(
                "confirmPassword",
                !passwordVisible.confirmPassword
              )
            }
          >
            {passwordVisible.confirmPassword ? <EyeCrossIcon /> : <EyeIcon />}
          </div>
        </label>

        <button
          className="btn btn-primary"
          aria-disabled={forgotPasswordPending}
          type="submit"
        >
          {forgotPasswordPending ? "Loading..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default Forgot;
