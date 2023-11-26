export const formatDuration = (
	duration: number,
	length: "long" | "medium" | "short",
    useComma: boolean = false
) => {
	const hours = Math.floor(duration / 60);
	const minutes = duration % 60;
	let output = `${minutes} minutes`;

	if (hours > 0) {
		if (minutes === 0) {
			output = `${hours} ${hours === 1 ? "hour" : "hours"}`;
		} else {
			output = `${hours} ${
				hours === 1 ? "hour" : "hours"
			}, ${minutes} minutes`;
		}
	}

	if (minutes === 1) {
		output.replace("minutes", "minute");
	}

    if (!useComma) {
        output = output.replace(",", " ");
    }

	switch (length) {
		case "short":
			return output.replace("hour", "h").replace("minute", "m");
		case "medium":
			return output.replace("hour", "hr").replace("minute", "min");
		case "long":
			return output;
	}
};
