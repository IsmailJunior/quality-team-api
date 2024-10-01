import Event from '../models/event.mjs';
import Hypermedia from '../models/hypermedia.mjs';

const createEventService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const event = await Event.create({ ...dto, hypermedia });
	return { event };
};

export default createEventService;
