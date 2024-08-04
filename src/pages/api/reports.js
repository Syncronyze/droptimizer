import { parse } from '@lib/parser';
import db from '@db';
import pool from '@lib/pool';
import { characters, encounters, instances, items, report_items, reports } from '@tables';
import { eq, sql } from 'drizzle-orm';

const URL_REGEX = /[1-9A-z]{22}/;
const URL_REPLACE = '$URLRPLC$';
const DATA_URL_STR = `https://www.raidbots.com/reports/${URL_REPLACE}/data.json`;
const REGULAR_URL_STR = `https://www.raidbots.com/simbot/report/${URL_REPLACE}`;

const cleanseURL = (url) => {
    const id = URL_REGEX.exec(url)?.[0];
    if (!id) return null;

    return {
        jsonURL: DATA_URL_STR.replace(URL_REPLACE, id),
        clickableURL: REGULAR_URL_STR.replace(URL_REPLACE, id),
    };
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    pool.messageClients(['encounters']);

    const { url } = JSON.parse(req.body);
    let raidbotsReport;
    let jsonURL;
    let clickableURL;
    try {
        if (!url) throw new Error('No URL.');
        const urls = cleanseURL(url);
        if (!urls) throw new Error('Invalid URL.');
        jsonURL = urls.jsonURL;
        clickableURL = urls.clickableURL;
    } catch (err) {
        console.error('Error with user input', err);
        res.status(400).json({ error: 'Bad request.' });
        return;
    }

    try {
        console.info('Fetching report', jsonURL);
        const raidbotsResponse = await fetch(jsonURL);
        raidbotsReport = await raidbotsResponse.json();
    } catch (err) {
        console.error('Error raidbots request', err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }

    const { character, report, instances, encounters, items, reportItems } = parse(raidbotsReport);

    try {
        await addInstances(instances);
        await addEncounters(encounters);
        await addItems(items);

        const char_id = await addCharacter(character);
        const report_id = await addReport({
            ...report,
            char_id,
            url: clickableURL,
        });
        await deleteReportItems(report_id);
        await addReportItems(reportItems.map((ri) => ({ ...ri, report_id })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
    console.info('Successfully added report.');

    res.status(200).json({ success: 'Successfully added report.' });
}
const addInstances = async (_instances) => {
    console.info(`Adding instances.`);
    await db.insert(instances).values(_instances).onConflictDoNothing();
};

const addEncounters = async (_encounters) => {
    console.info(`Adding encounters.`);
    await db.insert(encounters).values(_encounters).onConflictDoNothing();
};

const addItems = async (_items) => {
    console.info(`Adding items.`);
    await db.insert(items).values(_items).onConflictDoNothing();
};

const addCharacter = async (_character) => {
    console.info(`Adding character ${JSON.stringify(_character)}.`);
    const [result] = await db
        .insert(characters)
        .values(_character)
        .onConflictDoUpdate({
            target: [characters.name, characters.server],
            set: {
                name: sql`${_character.name}`,
            },
        })
        .returning({ id: characters.id });
    return result?.id;
};

const addReport = async (report) => {
    console.info(`Adding report ${JSON.stringify(report)}.`);
    const [result] = await db
        .insert(reports)
        .values(report)
        .onConflictDoUpdate({
            target: [reports.char_id, reports.spec_id, reports.instance_id, reports.difficulty],
            set: report,
        })
        .returning();

    return result?.id;
};

const deleteReportItems = async (report_id) => {
    console.info(`Deleting report items for report_id ${report_id}.`);
    await db.delete(report_items).where(eq(report_items.report_id, report_id));
};

const addReportItems = async (reportItems) => {
    console.info(`Adding report items.`);
    await db.insert(report_items).values(reportItems);
};
