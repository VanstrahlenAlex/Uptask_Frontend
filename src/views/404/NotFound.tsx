
import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<>
			<h1 className='font-black text-4xl text-center text-white'>Page not Found</h1>
			<p className='mt-10 text-center text-white'>
				Maybe you wanna go to : {''}
				<Link className='text-fuchsia-500' to={'/'}>Projects</Link>
			</p>
		</>
	)
}
