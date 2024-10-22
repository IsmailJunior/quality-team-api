// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectId } from 'bson';
import Bundle from '../models/bundle.mjs';
import Content from '../models/content.mjs';

const getStatsService = async (dto) => {
	const bundles = await Bundle.find({ user: dto.user.id });
	const uids = bundles.map((bundle) => new ObjectId(bundle.id));

	let allContents = 0;
	let approvedContents = 0;
	let rejectedContents = 0;
	let idleContents = 0;
	allContents = await Promise.all(
		uids.map(
			async (uid) =>
				await Content.aggregate([
					{
						$match: { bundle: uid },
					},
					{
						$group: {
							_id: { $toUpper: 'total' },
							total: { $sum: 1 },
						},
					},
				]),
		),
	);
	approvedContents = await Promise.all(
		uids.map(
			async (uid) =>
				await Content.aggregate([
					{
						$match: { bundle: uid, status: 'approved' },
					},
					{
						$group: {
							_id: { $toUpper: 'approved' },
							total: { $sum: 1 },
						},
					},
				]),
		),
	);
	rejectedContents = await Promise.all(
		uids.map(
			async (uid) =>
				await Content.aggregate([
					{
						$match: { bundle: uid, status: 'rejected' },
					},
					{
						$group: {
							_id: { $toUpper: 'rejected' },
							total: { $sum: 1 },
						},
					},
				]),
		),
	);
	idleContents = await Promise.all(
		uids.map(
			async (uid) =>
				await Content.aggregate([
					{
						$match: { bundle: uid, status: 'idle' },
					},
					{
						$group: {
							_id: { $toUpper: 'idle' },
							total: { $sum: 1 },
						},
					},
				]),
		),
	);

	const allContentsArray = allContents.map((group) =>
		Number(group.map((el) => el.total).join('')),
	);
	const total = allContentsArray.reduce((next, curr) => next + curr, 0);

	const approvedArray = approvedContents.map((group) =>
		Number(group.map((el) => el.total).join('')),
	);

	const approved = approvedArray.reduce((next, curr) => next + curr, 0);

	const rejectedArray = rejectedContents.map((group) =>
		Number(group.map((el) => el.total).join('')),
	);

	const rejected = rejectedArray.reduce((next, curr) => next + curr, 0);

	const idleArray = idleContents.map((group) =>
		Number(group.map((el) => el.total).join('')),
	);

	const idle = idleArray.reduce((next, curr) => next + curr, 0);

	return {
		total,
		approved,
		rejected,
		idle,
	};
};

export default getStatsService;
