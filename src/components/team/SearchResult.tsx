import { addUserToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
type SearchResultProps = {
	user: TeamMember,
	reset: () => void,
}
export default function SearchResult({user, reset} : SearchResultProps) {

	const navigate = useNavigate()
	const params = useParams()
	const projectId = params.projectId!
	
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: addUserToProject,
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: (data) => {
            toast.success(data)
			reset()
			navigate(location.pathname, {replace: true})
			queryClient.invalidateQueries({queryKey:  ['projectTeam', projectId]})
        }
	})

	const handleAddUserToProject = () => {
		const data = {
			projectId,
			id: user._id
		}
		mutate(data)
	}
	return (
		<>
			<p className="mt-10 text-center font-bold">Result:</p>
			<div className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-xl shadow-lg">
				<p className="text-xl">{user.name}</p>
				<button className="flex gap-2 text-purple-600 hover:bg-purple-200 px-10 py-3 font-bold cursor-pointer rounded-xl"
					onClick={handleAddUserToProject}
				>
					<PlusCircleIcon className="size-6 text-fuchsia-600" />
					Add to the Project</button>
			</div>
		</>
	)
}
