import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../utils/constant";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/userSlice";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [showEye, setShowEye] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const { message, success, ...usersData } = res.data;

      if (success) {
        toast.success(message);
        dispatch(setAuthUser(usersData));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      username: "",
      password: "",
    });
  };
  return (
    <div className="text-black min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100">
        <h1 className="text-4xl font-bold text-center text-gray-300">
          Login <span className="text-purple-500">ChatApp</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label className="label p-2">
              <span className="text-base label-text ">Username</span>
            </label>
            <input
              className="w-full input input-bordered text-white h-10"
              placeholder="Enter your username"
              type="text"
              value={user.username}
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
              }}
            />
          </div>
          <div className="">
            <label className="label p-2">
              <span className="text-base label-text ">Password</span>
            </label>
            <div className="relative">
              <input
                className="w-full input input-bordered text-white h-10"
                placeholder="Enter your password"
                type={showEye ? "password" : "text"}
                value={user.password}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
                }}
              />
              {isFocused && (
                <span
                  className="absolute inset-y-2.5 right-3 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents the button from taking focus
                    setShowEye((prev) => !prev);
                  }}
                >
                  {showEye ? (
                    <FaRegEye color="white" size={20} />
                  ) : (
                    <FaRegEyeSlash color="white" size={20} />
                  )}
                </span>
              )}
            </div>
          </div>

          <Link
            to="/register"
            className="block text-gray-400 mt-2 ml-2 hover:underline hover:text-purple-500"
          >
            Don't have an account? Signup
          </Link>

          <div className="mt-2">
            <button
              className="btn btn-block btn-sm border 
         border-slate-700"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
