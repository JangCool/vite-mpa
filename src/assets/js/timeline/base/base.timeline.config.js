const DefaultConfig = {
    id: null,
    height: '300px',
    start: null,
    end: null,
    dateTimeFormat: null,
    events: {
        onClick: function() {},
        onDblClick: function() {},
        onMouseover: function() {},
        onMouseout: function() {},
        onContextmenu: function() {},
        onSelect: function() {},
        onAddItem: function() {},
        onRemoveItem: function() {},
        onUpdateItem: function() {},
        onAddGroup: function() {},
        onRemoveGroup: function() {},
        // onRangechange: function() {},
        // onRangechanged: function() {}
    },
    template: function() {},
    tooltip: {
        formatter: ()=> {

        }
    }
}

export default DefaultConfig;