import {VideoType} from "../types/videos-types";

export let db: VideoType[] = [
    {
        id: 0,
        title: 'How I learn Back-end',
        author: 'Pavlo Dokai',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-03-27T20:17:51:59.1247",
        publicationDate: "2023-03-28T20:17:51:59.1247",
        availableResolutions: ["P720"]
    },
    {
        id: 1,
        title: 'My progress in learning',
        author: 'Pavlo Dokai',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2023-03-28T20:17:51:59.1247",
        publicationDate: "2023-03-29T20:17:51:59.1247",
        availableResolutions: ["P720"]
    },
    {
        id: 2,
        title: `I've bought new camera. Check it out`,
        author: 'Pavlo Dokai',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-03-30T20:17:51:59.1247",
        publicationDate: "2023-03-31T20:17:51:59.1247",
        availableResolutions: ["P720","P2160"]
    }
];

export const supportedResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
