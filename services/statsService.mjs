// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectId } from 'bson';
import Content from '../models/content.mjs';

const getStatsService = async (dto) => {
	const uid = new ObjectId(dto.subscriptionId);
	const totalContent = await Content.aggregate([
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
	const approvedContent = await Content.aggregate([
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
	const idleContent = await Content.aggregate([
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
	const rejectedContent = await Content.aggregate([
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
	return {
		totalContent,
		approvedContent,
		idleContent,
		rejectedContent,
	};
};

export default getStatsService;
