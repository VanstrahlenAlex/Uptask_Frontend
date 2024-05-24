export function formatDate(isoString: string) : string {
	const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('en-En', 
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            
		}
	)
	return formatter.format(date)
}