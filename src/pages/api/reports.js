import { supabase } from '@lib/supabase';
import testReport from '/dev/test-report';
import { parse } from '@lib/parser';

const URL_REGEX = /[1-9A-z]{22}/;
const URL_REPLACE = '$URLRPLC$';
const URL_STR = `https://www.raidbots.com/reports/${URL_REPLACE}/data.json`;

const cleanseURL = (url) => {
    const id = URL_REGEX.exec(url)?.[0];
    if (!id) return null;

    return URL_STR.replace(URL_REPLACE, id);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // const { url } = req.body;
    const url = 'https://www.raidbots.com/simbot/report/8B78pbB264V58HFTjdCAyt';
    console.info('url', url);
    const cleanURL = cleanseURL(url);
    console.info('cleanURL', cleanURL);
    const { character, report, instances, encounters, items, encounterItems, reportItems } =
        parse(testReport);

    try {
        const instance_ids = instances.map((instance) => instance.id);

        const char_id = await addCharacter(character);
        const report_id = await addReport({ ...report, char_id });
        await deleteReportItems(report_id);
        await addReportItems(reportItems.map((ri) => ({ ...ri, report_id })));

        // if there's a mismatch between the count of spec + instance ID
        // we need to update all items + encounters for this spec.
        // it's assumed that if a spec has been seen before for this instance,
        // the encounterItems have previously been generated.
        if (await isNewSpec(report.spec_id, instance_ids)) {
            await addInstances(instances);
            await addSpecInstances(
                instances.map((instance) => ({
                    spec_id: report.spec_id,
                    instance_id: instance.id,
                })),
            );
            await addEncounters(encounters);
            await addItems(items);
            await addEncounterItems(encounterItems);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
    console.info('Successfully added report.');
    res.status(200).json({ success: 'Successfully added report.' });
}

const isNewSpec = async (spec_id, instance_ids) => {
    console.info(
        `Checking if ${spec_id} has any missing instance IDs: ${JSON.stringify(instance_ids)}`,
    );
    const { count, error } = await supabase
        .from('spec_instances')
        .select('instance_id', { count: 'exact', head: true })
        .eq('spec_id', spec_id)
        .in('instance_id', instance_ids);

    if (error)
        throw new Error(
            `Could not count new instance(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );

    const ret = instance_ids.length > count;
    console.info(`New spec? ${ret}`);

    // if our instance_ids is larger than the count returned, we're missing some or all instances.
    return ret;
};

const addSpecInstances = async (specInstances) => {
    console.info(`Adding spec instances.`);
    const { error } = await supabase
        .from('spec_instances')
        .upsert(specInstances, { onConflict: ['spec_id', 'instance_id'] });

    if (error)
        throw new Error(
            `Could not add new spec instance(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addInstances = async (instances) => {
    console.info(`Adding instances.`);
    const { error } = await supabase.from('instances').upsert(instances, { onConflict: 'id' });

    if (error)
        throw new Error(
            `Could not add new instance(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addEncounters = async (encounters) => {
    console.info(`Adding encounters.`);
    const { error } = await supabase.from('encounters').upsert(encounters, { onConflict: 'id' });

    if (error)
        throw new Error(
            `Could not add new encounter(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addItems = async (items) => {
    console.info(`Adding items.`);
    const { error } = await supabase.from('items').upsert(items);

    if (error)
        throw new Error(
            `Could not add new item(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addEncounterItems = async (encounterItems) => {
    console.info(`Adding encounter items.`);
    const { error } = await supabase.from('encounter_items').upsert(encounterItems);

    if (error)
        throw new Error(
            `Could not add new encounter_item(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addCharacter = async (character) => {
    console.info(`Adding character ${JSON.stringify(character)}.`);
    const { data, error } = await supabase
        .from('characters')
        .upsert(character, { returning: 'representation', onConflict: ['name', 'server'] })
        .select();

    if (error)
        throw new Error(
            `Could not add new character - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );

    return data[0].id;
};

const addReport = async (report) => {
    console.info(`Adding report ${JSON.stringify(report)}.`);
    const { data, error } = await supabase
        .from('reports')
        .upsert(report, { returning: 'representation', onConflict: ['char_id', 'spec_id'] })
        .select();

    if (error)
        throw new Error(
            `Could not add new report - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );

    return data[0].id;
};

const deleteReportItems = async (report_id) => {
    console.info(`Deleting report items for report_id ${report_id}.`);
    const { error } = await supabase.from('report_items').delete().eq('report_id', report_id);
    if (error)
        throw new Error(
            `Could not delete old report items - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};

const addReportItems = async (reportItems) => {
    console.info(`Adding report items.`);
    const { error } = await supabase.from('report_items').insert(reportItems);
    if (error)
        throw new Error(
            `Could not add old report items - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );
};
