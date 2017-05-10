// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

window.djbug_data = {};
window.djbug_no_django = false;

function render() {

  clear_panes();

  chrome.devtools.inspectedWindow.eval(
    "dj_chrome",
    function (result, isException) {
      if (isException) {
        $('.no-django').modal({ backdrop: 'static', keyboard: false });
        window.djbug_no_django = true;
      } else {
        var version = result.version;
        djangoVersion = version[0] + '.' + version[1] + '.' + version[2] + '-' + version[3];

        // bind this to the global var
        window.djbug_data = result;

        $('.django-version').html(djangoVersion);

        if (window.djbug_no_django) {
          $('.no-django').modal('hide');
          window.djbug_no_django = false;
        }

        build_panes();
      }
    }
  );

  $(".se-pre-con").fadeOut("slow");

}

function clear_panes() {
  var query_table = $('.query-table tbody');
  var settings_table = $('.settings-table tbody');
  var warnings_pane = $('.warnings-table tbody');
  var mro_pane = $('.bases-list');
  var view_data_pane = $('.cbv-table tbody');

  [query_table, settings_table, warnings_pane, mro_pane, view_data_pane].forEach(function(el) {
    el.html("");
  });

}


$().ready(function() {
  render();
});


chrome.devtools.network.onNavigated.addListener(function(){
  $(".se-pre-con").fadeIn("fast");
  window.setTimeout(render, 1000);
});

function build_panes() {

  // Database queries
  var queries = window.djbug_data.db_queries
  var query_table = $('.query-table tbody')

  $('.query-count').html(queries.length);

  for (i in queries) {
    row = $("<tr>");
    row.append($("<td>").html(queries[i].time));
    row.append($("<td>").html($('<pre>').html($('<code>').addClass('sql').html(queries[i].sql))));
    query_table.append(row);
  }

  // Django Settings
  var settings = window.djbug_data.settings
  var settings_table = $('.settings-table tbody')
  Object.keys(settings).forEach(function(key) {
    row = $("<tr>");
    row.append($("<td>").html(key));
    value = JSON.stringify(settings[key], null, 4);
    row.append($("<td>").html($('<code>').html(value)));
    settings_table.append(row);
  });

  // Warnings
  var checks = window.djbug_data.checks
  var warnings_table = $('.warnings-table tbody');
  Object.keys(checks).forEach(function(key) {
    var check_level = 'text-warning'

    // check level
    if (checks[key].level < 30)
      check_level = 'text-info';
    else if (checks[key].level > 30)
      check_level = 'text-danger';

    row = $("<tr>");
    row.append($("<td>").html(key));
    value = JSON.stringify(checks[key], null, 4);
    row.append($("<td>").html($('<span>').addClass(check_level).html(value)));
    warnings_table.append(row);
  });

  var warning_count = Object.keys(checks).length;

  // Some custom warnings that aren't worth the installation overhead of building
  // into a Django app config
  if (settings.APPEND_SLASH) {
    row = $("<tr>");
    row.append($("<td>").html('djdev.I001'));
    row.append($("<td>").html($('<span>').addClass('text-info').html(
      '"Django is automatically appending trailing slashes to URLs.  Check the APPEND_SLASH setting to change."')));
    warnings_table.append(row);
    warning_count++;
  }



  $('.warning-count').html(warning_count);

  // CBV Introspection

  $('.cbv-tab').hide();
  if (window.djbug_data.view_data.cbv){
    cbv_data = window.djbug_data.view_data;
    $('.cbv-tab').show();
    $('.cbv-name').html(cbv_data.view_name);

    // Populate MRO
    cbv_data.bases.forEach(function(key) {
      var base = $('<li>').addClass('list-group-item').text(key);
      $('.bases-list').append(base);
    });

    // Populate Method Calls
    Object.keys(cbv_data.view_methods).forEach(function(key) {
      var row = $('<tr>').append(
        $('<td>').html(
          $('<code>').text(key)));
      row.append($('<td>').html($('<code>').text(cbv_data.view_methods[key].return)));
      $('.cbv-table tbody').append(row);
    });
  }


  // Other Info
  $('.current-user').html($('<pre>').html($('<code>').addClass('json').html(JSON.stringify(window.djbug_data.current_user, null, 4))));
  $('.session-data').html($('<pre>').html($('<code>').html(JSON.stringify(window.djbug_data.session, null, 4))));
  $('.current-view').html($('<code>').html(window.djbug_data.view_data.view_name));
  $('.current-view-args').html($('<code>').html(JSON.stringify(window.djbug_data.view_data.view_args)));
  $('.current-view-kwargs').html($('<code>').html(JSON.stringify(window.djbug_data.view_data.view_kwargs)));
  $('.url-namespaces').html($('<code>').html(JSON.stringify(window.djbug_data.url_namespaces)));
  $('.url-name').html($('<code>').html(window.djbug_data.url_name));

  $('pre > code').each(function() {
    hljs.highlightBlock(this);
  });


}
