app.factory('Query_networks', 
[ 'util',
function( util ){ return function( Query ){
  
  var q = Query;
  var qfn = q.prototype;

  //
  // NETWORKS

  qfn.toggleNetworksToMatchQuery = function( q2, pub ){
    var q1 = this;

    for( var i = 0; i < q2.networks.length; i++ ){
      var net = q2.networks[i];

      q1.toggleNetworkSelection( net.id, net.selected, false );
    }

    if( pub || pub === undefined ){
      PubSub.publish( 'query.toggleNetworkSelection', {
        query: q1,
        otherQuery: q2
      } );
    }
  };

  qfn.updateNetworkGroupSelection = function( group ){
    var selCount = group.selectedCount;
    var netCount = group.interactionNetworks ? group.interactionNetworks.length : 0;

    if( selCount === 0 ){
      group.selected = false;
    } else if( selCount === netCount ){
      group.selected = true;
    } else {
      group.selected = 'semi';
    }
  };

  qfn.getNetwork = function( idOrNet ){
    if( $.isPlainObject( idOrNet ) ){
      var net = idOrNet;
      return net;
    } else {
      var id = idOrNet;
      return this.networksById[ id ];
    }
  };

  qfn.getNetworkGroup = function( idOrGr ){
    if( $.isPlainObject( idOrGr ) ){
      var gr = idOrGr;
      return gr;
    } else {
      var id = idOrGr;
      return this.networkGroupsById[ id ];
    }
  };

  qfn.toggleNetworkSelection = function( net, sel, pub ){
    net = this.getNetwork( net );
    sel = sel === undefined ? !net.selected : sel; // toggle if unspecified selection state

    if( net.selected === sel ){ return; } // update unnecessary

    net.selected = sel;
    net.group.selectedCount += sel ? 1 : -1;
    this.updateNetworkGroupSelection( net.group );

    if( pub || pub === undefined ){
      pub = { network: net, query: this, selected: sel };
      PubSub.publish( sel ? 'query.selectNetwork' : 'query.unselectNetwork', pub );
      PubSub.publish( 'query.toggleNetworkSelection', pub );
    }
  };
  qfn.selectNetwork = function( net, pub ){ this.toggleNetworkSelection(net, true, pub); };
  qfn.unselectNetwork = function( net, pub ){ this.toggleNetworkSelection(net, false, pub); };

  qfn.toggleNetworkGroupSelection = function( group, sel ){
    group = this.getNetworkGroup( group );

    if( sel === undefined ){ // toggle if unspecified selection state
      sel = !group.selected || group.selected === 'semi' ? true : false;
    }

    var nets = group.interactionNetworks;
    for( var i = 0; i < nets.length; i++ ){
      var net = nets[i];

      this.toggleNetworkSelection( net.id, sel );
    }

    var pub = { query: this, group: group, selected: sel };
    PubSub.publish( sel ? 'query.selectNetworkGroup' : 'query.unselectNetworkGroup', pub );
    PubSub.publish( 'query.toggleNetworkGroupSelection', pub );
  };
  qfn.selectNetworkGroup = function( gr ){ this.toggleNetworkGroupSelection(gr, true); };
  qfn.unselectNetworkGroup = function( gr ){ this.toggleNetworkGroupSelection(gr, false); };

  qfn.toggleNetworkExpansion = function( net, exp ){
    net = this.getNetwork( net );
    exp = exp === undefined ? !net.expanded : exp; // toggle if unspecified

    if( net.expanded === exp ){ return net.expanded; } // update unnecessary

    net.expanded = exp;

    var pub = { network: net, query: this, expanded: exp };
    PubSub.publish( exp ? 'query.expandNetwork' : 'query.collapseNetwork', pub );
    PubSub.publish( 'query.toggleNetworkExpansion', pub );

    return net.expanded;
  };
  qfn.expandNetwork = function( net ){ return this.toggleNetworkExpansion(net, true); };
  qfn.collapseNetwork = function( net ){ return this.toggleNetworkExpansion(net, false); };

  qfn.toggleNetworkGroupExpansion = function( group, exp ){
    group = this.getNetworkGroup( group );
    exp = exp === undefined ? !group.expanded : exp; // toggle if unspecified

    group.expanded = exp;

    var pub = { group: group, query: this, expanded: exp };
    PubSub.publish( exp ? 'query.expandNetworkGroup' : 'query.collapseNetworkGroup', pub );
    PubSub.publish( 'query.toggleNetworkGroupExpansion', pub );

    return group.expanded;
  };

  // for an array of network objects { id, selected }, set selected
  qfn.setNetworks = function( nets ){
    if( _.isArray(nets) ){
      for( var i = 0; i < nets.length; i++ ){
        var net = nets[i];

        net.selected ? this.selectNetwork( net.id, false ) : this.unselectNetwork( net.id, false );
      }
    } else if( _.isString(nets) ){
      var setter = _.find( this.setNetworkOptions, { name: nets } );

      if( !setter ){ return; } // can't set w/o setter
      setter = setter.setter; // we only want the function
 
      for( var i = 0; i < this.networks.length; i++ ){
        var network = this.networks[i];

        if( setter( network ) ){
          this.selectNetwork( network, false );
        } else {
          this.unselectNetwork( network, false );
        }
      }
    }

    this.showingNetworkCheckOptions = false; // because we set

    PubSub.publish( 'query.setNetworks', {
      query: this
    } );
  };

  qfn.toggleNetworkCheckOptions = function(){
    this.showingNetworkCheckOptions = this.showingNetworkCheckOptions ? false : true;

    PubSub.publish('query.toggleNetworkCheckOptions', {
      shown: this.showingNetworkCheckOptions,
      query: this
    });
  };

  qfn.toggleNetworkSortOptions = function(){
    this.showingNetworkSortOptions = this.showingNetworkSortOptions ? false : true;

    PubSub.publish('query.toggleNetworkSortOptions', {
      shown: this.showingNetworkSortOptions,
      query: this
    });
  };

  qfn.sortNetworksBy = function( factor ){
    var self = this;

    factor = _.find(self.networkSortFactors, function(f){
      return f.name === factor || f === factor;
    });

    if( factor ){

      this.selectedNetworkSortFactor = factor;

      for( var i = 0; i < this.networkGroups.length; i++ ){
        var gr = this.networkGroups[i];
        var nets = gr.interactionNetworks;

        if( nets ){
          nets.sort( factor.sorter );
        }
      }

      this.showingNetworkSortOptions = false; // because we've set it

      PubSub.publish('query.sortNetworksBy', {
        factor: factor,
        query: this
      });
    }
  };
  

} } ]);