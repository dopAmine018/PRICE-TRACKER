(function(){
  window.ALL_ROWS = window.ALL_ROWS || [];
  // Only define addRows if it doesn't exist, to avoid breaking the event-dispatching version
  if (!window.addRows) {
    window.addRows = function(rows){
      if (!rows || !Array.isArray(rows)) return;
      for (const r of rows) {
        if (Array.isArray(r) && r.length >= 3) {
          window.ALL_ROWS.push(r);
        }
      }
      window.dispatchEvent(new CustomEvent('rows_updated'));
    };
  }
})();