import { ChangeEvent, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/en';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';

export default function TaskModalDetails() {
	const params = useParams();
	const projectId = params.projectId!;
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const taskId = queryParams.get('viewTask');
	const show = taskId ? true: false;

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['task', taskId],
		queryFn: () => getTaskById({ projectId, taskId : taskId! }),
		enabled: !!taskId,
		retry: false,
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: updateStatus,
		onError: (error: Error) => {
		toast.error(error.message);
		},
		onSuccess: (data) => {
		toast.success(data);
		queryClient.invalidateQueries({ queryKey: ['project', projectId] });
		queryClient.invalidateQueries({ queryKey: ['task', taskId] });
		},
	});

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const status = e.target.value as TaskStatus;
		const data = { projectId, taskId: taskId!, status };
		mutation.mutate(data);
	};

	useEffect(() => {
		if (isError && error) {
		toast.error((error as Error).message, { toastId: 'error' });
		navigate(`/projects/${projectId}`);
		}
	}, [isError, error, navigate, projectId]);

	if (isLoading) return <p>Loading...</p>;

	if (!data) return null;

	return (
		<>
		<Transition appear show={show} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 bg-black/60" />
			</Transition.Child>

			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
					<p className="text-sm text-slate-400">Added on: <span className="font-bold">{formatDate(data.createdAt)}</span></p>
					<p className="text-sm text-slate-400">Last updated: <span className="font-bold">{formatDate(data.updatedAt)}</span></p>
					<Dialog.Title
						as="h3"
						className="font-black text-4xl text-slate-600 my-5"
					>{data.name}
					</Dialog.Title>
					<p className="text-lg text-slate-500 mb-2">Description: {data.description}</p>
					{data.completedBy.length ? (
						<>
						<p className="font-bold text-2xl text-slate-600 my-5">History of changes</p>
						<ul className="list-decimal pl-5">
							{data.completedBy.map((activityLog) => (
							<li key={activityLog._id}>
								<span className="font-bold text-slate-600">{statusTranslations[activityLog.status]} </span>{''} by: {''}
								{activityLog.user.name}
							</li>
							))}
						</ul>
						</>
					) : null}

					<div className="my-5 space-y-3">
						<label className="font-bold">Current Status: </label>
						<select
						className="w-full p-3 bg-white border border-gray-300"
						defaultValue={data.status}
						onChange={handleChange}
						>
						{Object.entries(statusTranslations).map(([key, value]) => (
							<option value={key} key={key}>{value}</option>
						))}
						</select>
					</div>
					<NotesPanel notes={data.notes} />
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
		</>
	);
}
