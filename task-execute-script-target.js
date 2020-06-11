var data = JSON.parse(document.body.textContent);
var alldata = new Map();
data.forEach((task_template) => {
    task_template.taskTemplates.forEach((task) => {
        deleted = (typeof task.deleted === 'undefined')?'undefined':task.deleted.toString();
        active = (typeof task.active === 'undefined')?'undefined':task.active.toString();
        duration = (typeof task.expectedTaskDuration === 'undefined')?'undefined':task.expectedTaskDuration.toString();
        alldata.set(task.id, {
            'id': task.id,
            'owner': task_template.taskOwnerContact,
            'email': task_template.taskOwnerContactEmail,
            'deleted': deleted,
            'active': active,
            'name': task.taskName,
            'description': task.taskDescription,
            'function': task.taskFunction,
            'role': task.taskJobRole,
            'process': task.taskProcess,
            'language': task.language,
            'expected_duration': duration,
            'recurrence': task.taskRecurrence,
            'start_time': task.taskStartTime,
            'criticality': task.taskCriticality,
        });
    });
});

let csvContent = "data:text/csv;charset=utf-8,";
csvContent += '"ID","Task Function","Task Name","Task Description","Recurrence","Expected Duration","Role","Criticality","Active","Deleted","Owner","Owner Email","Link"' + '\\u000A';
alldata.forEach(function(record) {
    csvContent += makecsv(record);
});
var encodedUri = encodeURI(csvContent);
console.log(csvContent);
window.open(encodedUri);

function makecsv(record) {
    id = record.id;
    task = alldata.get(id);
    line = '';
    line += '"' + task.id.replace(/"/g, '""') + '",';
    line += '"' + task.function.replace(/"/g, '""') + '",';
    line += '"' + task.name.replace(/"/g, '""') + '",';
    line += '"' + task.description.replace(/"/g, '""') + '",';
    line += '"' + task.recurrence.replace(/"/g, '""') + '",';
    line += '"' + task.expected_duration.replace(/"/g, '""') + '",';
    line += '"' + task.role.replace(/"/g, '""') + '",';
    line += '"' + task.criticality.replace(/"/g, '""') + '",';
    line += '"' + task.active.replace(/"/g, '""') + '",';
    line += '"' + task.deleted.replace(/"/g, '""') + '",';
    line += '"' + task.owner.replace(/"/g, '""') + '",';
    line += '"' + task.email.replace(/"/g, '""') + '",';
    line += '"' + window.location.origin + '/' + task.language + '/manage-tasks?taskId=' + task.id.replace(/"/g, '""') + '"' + '\\u000A';
    return line;
}
