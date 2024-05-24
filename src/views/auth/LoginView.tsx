import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

	const initialValues: UserLoginForm = {
		email: '',
		password: '',
	}
	const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

	const navigate = useNavigate();
	const { mutate } = useMutation({
		mutationFn: authenticateUser,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			navigate("/");
		}
	})
	const handleLogin = (formData: UserLoginForm) => { 
		mutate(formData)
	}

	return (
		<>
		<h1 className="text-5xl font-black text-white">Log in</h1>
		<p className="text-2xl font-light text-white mt-5">
			Start planning your projects{''}
			<span className=" text-fuchsia-500 font-bold"> Log in</span>
		</p>
		<form
			onSubmit={handleSubmit(handleLogin)}
			className="space-y-8 p-10 bg-white rounded-lg mt-10"
			noValidate
		>
			<div className="flex flex-col gap-5">
			<label
				className="font-normal text-2xl"
			>Email</label>

			<input
				id="email"
				type="email"
				placeholder="Registration Email"
				className="w-full p-3  border-gray-300 border"
				{...register("email", {
				required: "The Email is mandatory",
				pattern: {
					value: /\S+@\S+\.\S+/,
					message: "Invalid e-mail",
				},
				})}
			/>
			{errors.email && (
				<ErrorMessage>{errors.email.message}</ErrorMessage>
			)}
			</div>

			<div className="flex flex-col gap-5">
			<label
				className="font-normal text-2xl"
			>Password</label>

			<input
				type="password"
				placeholder="Registration password"
				className="w-full p-3  border-gray-300 border"
				{...register("password", {
				required: "Password is mandatory",
				})}
			/>
			{errors.password && (
				<ErrorMessage>{errors.password.message}</ErrorMessage>
			)}
			</div>

			<input
			type="submit"
			value='Login'
			className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
			/>
		</form>
		<nav className="mt-10 flex flex-col space-y-4 ">
			<Link to={"/auth/register"} 
				className="text-center text-gray-300 font-normal "
			>You don't have a Account? <span className="hover:text-fuchsia-500"> Register please</span>
			</Link>
			<Link to={"/auth/forgot-password"} 
				className="text-center text-gray-300 font-normal "
			>You forget your Password? <span className="hover:text-fuchsia-500"> Reset Password please</span>
			</Link>
		</nav>
		</>
	)
}