
(function(){
  window.ALL_ROWS = window.ALL_ROWS || [];
  window.addRows = function(rows){
    if (!rows || !Array.isArray(rows)) return;
    for (const r of rows) if (Array.isArray(r) && r.length >= 3) window.ALL_ROWS.push(r);
  };
})();
