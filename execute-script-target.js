var data = JSON.parse(document.body.textContent);
var baddata = [];
var gooddata = [];
var checkdata = [];
data.forEach((resource) => {
  resource.resourceLanguages.forEach((resourceLanguage) => {
    id = resourceLanguage.resourceId;
    link = resourceLanguage.resourceLink;
    name = resourceLanguage.resourceName;
    language = resourceLanguage.language;
    checkdata.push({'id': id, 'link': link, 'name': name, 'language': language});
  });
});
let requests = [];
checkdata.forEach((resource) => {
  if(resource.link != '') {
    requests.push(checklink(resource));
  } else {
    baddata.push({'id': resource.id, 'link': resource.link, 'name': resource.name, 'language': resource.language, 'msg': 'empty link'});
  }
});

Promise.all(requests).then(allfinished);

function allfinished() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += '"Resource Name","Resource Link","Link","Status message"' + '\\u000A';
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
  line = '"' + record.name.replace(/"/g, '""') + '",';
  line += '"' + record.link.replace(/"/g, '""').replace(/#/g, '%23') + '",';
  line += '"' + window.location.origin + '/' + record.language + '/resources?resourceId=' + record.id.replace(/"/g, '""') + '",';
  line += '"' + msgprefix + ': ' + record.msg.toString().replace(/"/g, '""') + '"' + '\\u000A';
  return line;
}

function checklink(resource) {
  return fetch(resource.link).then(
    function(response) {
      if(response.status >= 200 && response.status <= 299) {
        gooddata.push({'id': resource.id, 'link': resource.link, 'name': resource.name, 'language': resource.language, 'msg': response.status});
      } else {
        baddata.push({'id': resource.id, 'link': resource.link, 'name': resource.name, 'language': resource.language, 'msg': response.status});
      }
    }
  ).catch(function(err) {
    baddata.push({'id': resource.id, 'link': resource.link, 'name': resource.name, 'language': resource.language, 'msg': err});
  });
}
