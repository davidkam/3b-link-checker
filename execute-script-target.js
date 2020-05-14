var data = JSON.parse(document.body.textContent);
var baddata = [];
var gooddata = [];
var alldata = new Map();
data.forEach((resource) => {
    resource.resourceLanguages.forEach((resourceLanguage) => {
        alldata.set(resourceLanguage.resourceId, {
            'id': resourceLanguage.resourceId,
            'link': resourceLanguage.resourceLink,
            'name': resourceLanguage.resourceName,
            'resource_type': resourceLanguage.resourceType,
            'language': resourceLanguage.language,
            'owner': resourceLanguage.resourceContactEmail,
            'created': resourceLanguage.createdAt,
            'updated': resourceLanguage.updatedAt
        });
    });
});
let requests = [];
alldata.forEach(function(resource, resourceId) {
    if (resource.link != '') {
        requests.push(checklink(resource));
    } else {
        baddata.push({
            'id': resourceId,
            'msg': 'empty link'
        });
    }
});
Promise.all(requests).then(allfinished);

function allfinished() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += '"Status Message","Resource Name","Resource Type","Owner","Created At","Last Modified","Resource Link","Link"' + '\\u000A';
    gooddata.forEach(function(record) {
        csvContent += makecsv(record, 'GOOD');
    });
    baddata.forEach(function(record) {
        csvContent += makecsv(record, 'ERROR');
    });
    var encodedUri = encodeURI(csvContent);
    console.log(csvContent);
    window.open(encodedUri);
}

function makecsv(record, msgprefix) {
    id = record.id;
    resource = alldata.get(id);
    line = '"' + msgprefix + ': ' + record.msg.toString().replace(/"/g, '""') + '",';
    line += '"' + resource.name.replace(/"/g, '""') + '",';
    line += '"' + resource.resource_type.replace(/"/g, '""') + '",';
    line += '"' + resource.owner.replace(/"/g, '""') + '",';
    line += '"' + resource.created.replace(/"/g, '""') + '",';
    line += '"' + resource.updated.replace(/"/g, '""') + '",';
    line += '"' + resource.link.replace(/"/g, '""').replace(/#/g, '%23') + '",';
    line += '"' + window.location.origin + '/' + resource.language + '/resources?resourceId=' + resource.id.replace(/"/g, '""') + '"' + '\\u000A';
    return line;
}

function checklink(resource) {
    return fetch(resource.link).then(function(response) {
        if (response.status >= 200 && response.status <= 299) {
            gooddata.push({
                'id': resource.id,
                'msg': response.status
            });
        } else {
            baddata.push({
                'id': resource.id,
                'msg': response.status
            });
        }
    }).catch(function(err) {
        baddata.push({
            'id': resource.id,
            'msg': err
        });
    });
}
