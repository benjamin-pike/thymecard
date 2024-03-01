import { ITime } from "@thymecard/types";

export const minsToHoursAndMins = (mins: number) => {
	const hours = Math.floor(mins / 60);
	const minutes = mins % 60;
	return { hours, minutes };
};

export const hoursAndMinsToMins = (time: ITime) => {
    return time.hours * 60 + time.minutes;
}

export const formatDuration = (
	duration: number,
	length: "long" | "medium" | "short",
	useComma: boolean = false
) => {
	const { hours, minutes } = minsToHoursAndMins(duration);
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
