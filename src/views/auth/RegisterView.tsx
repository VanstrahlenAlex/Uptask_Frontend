import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; 
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
	
	const initialValues: UserRegistrationForm = {
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
	}

	const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });
	const { mutate } = useMutation({
		mutationFn: createAccount,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			toast.success(data)
			reset()
		}
	})
	const password = watch('password');

	const handleRegister = (formData: UserRegistrationForm) => {
		mutate(formData)
		
	}

	return (
		<>
		<h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
		<p className="text-2xl font-light text-white mt-5">
			Llena el formulario para {''}
			<span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
		</p>

		<form
			onSubmit={handleSubmit(handleRegister)}
			className="space-y-8 p-10  bg-white mt-10"
			noValidate
		>
			<div className="flex flex-col gap-5">
			<label
				className="font-normal text-2xl"
				htmlFor="email"
			>Email</label>
			<input
				id="email"
				type="email"
				placeholder="Registration Email"
				className="w-full p-3  border-gray-300 border"
				{...register("email", {
				required: "Registration email is required",
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
			>Name</label>
			<input
				type="name"
				placeholder="Registration Name"
				className="w-full p-3  border-gray-300 border"
				{...register("name", {
				required: "Username is required",
				})}
			/>
			{errors.name && (
				<ErrorMessage>{errors.name.message}</ErrorMessage>
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
				minLength: {
					value: 8,
					message: 'Password must be a minimum of 8 characters'
				}
				})}
			/>
			{errors.password && (
				<ErrorMessage>{errors.password.message}</ErrorMessage>
			)}
			</div>

			<div className="flex flex-col gap-5">
			<label
				className="font-normal text-2xl"
			>Repeat the password</label>

			<input
				id="password_confirmation"
				type="password"
				placeholder="Repeat registration password"
				className="w-full p-3  border-gray-300 border"
				{...register("password_confirmation", {
				required: "Repeat Password is mandatory",
				validate: value => value === password || 'Passwords are not the same'
				})}
			/>

			{errors.password_confirmation && (
				<ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
			)}
			</div>

			<input
			type="submit"
			value='Register'
			className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
			/>
		</form>
		<nav className="mt-10 flex flex-col space-y-4 ">
			<Link to={"/auth/login"} 
				className="text-center text-gray-300 font-normal "
			>Do you have a Account? <span className="hover:text-fuchsia-500"> Login please</span></Link>
			<Link to={"/auth/forgot-password"} 
				className="text-center text-gray-300 font-normal "
			>You forget your Password? <span className="hover:text-fuchsia-500"> Reset Password please</span>
			</Link>
		</nav>
		</>
	)
}