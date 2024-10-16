// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectId } from 'bson';
import Bundle from '../models/bundle.mjs';
import Content from '../models/content.mjs';

const getStatsService = async (dto) => {
	const bundles = await Bundle.find({ user: dto.user.id });
	const uids = bundles.map((bundle) => new ObjectId(bundle.id));
	let totalContents = await Promise.all(
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

	if (totalContents.length === 0) {
		totalContents = 0;
	}
	return {
		totalContents,
	};
};

export default getStatsService;
