// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectId } from 'bson';
import Content from '../models/content.mjs';

const getStatsService = async (dto) => {
	const uid = new ObjectId(dto.subscriptionId);
	let totalContent = await Content.aggregate([
		{
			$match: { subscription: uid },
		},
		{
			$group: {
				_id: { $toUpper: 'content' },
				total: { $sum: 1 },
			},
		},
	]);
	if (totalContent.length === 0) {
		totalContent = 0;
	}
	let approvedContent = await Content.aggregate([
		{
			$match: { subscription: uid },
		},
		{
			$match: { status: 'approved' },
		},
		{
			$group: {
				_id: { $toUpper: 'approved' },
				total: { $sum: 1 },
			},
		},
	]);
	if (approvedContent.length === 0) {
		approvedContent = 0;
	}
	let idleContent = await Content.aggregate([
		{
			$match: { subscription: uid },
		},
		{
			$match: { status: 'idle' },
		},
		{
			$group: {
				_id: { $toUpper: 'idle' },
				total: { $sum: 1 },
			},
		},
	]);

	if (idleContent.length === 0) {
		idleContent.length = 0;
	}
	let rejectedContent = await Content.aggregate([
		{
			$match: { subscription: uid },
		},
		{
			$match: { status: 'rejected' },
		},
		{
			$group: {
				_id: { $toUpper: 'rejected' },
				total: { $sum: 1 },
			},
		},
	]);
	if (rejectedContent.length === 0) {
		rejectedContent = 0;
	}
	return {
		totalContent,
		approvedContent,
		idleContent,
		rejectedContent,
	};
};

export default getStatsService;
