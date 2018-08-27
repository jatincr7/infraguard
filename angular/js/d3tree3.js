var DYNAMICTREE = DYNAMICTREE || {};

/*
var initialJson = {
    "name": "RightCloud",
    "status": 1,
    "children": [{
        "name": "InfraGuard",
        "status": 1,
        "children": [{"name": "Server 1","status": 1, "children": [{"name": "user1", "status": 0},{"name": "user2","status": 1}]},{"name":"Server 2", "status": 0,"children" : [{"name": "user1", "status": 1},{"name": "user2", "status": 0}]}, {"name": "Server 3", "status": 1, "children": [{"name": "user1", "status": 0},{"name": "user2", "status": 1}]}]
    },
       {
        "name": "Project2",
        "status": 0,
        "children": [{"name": "Server 1","status": 1, "children": [{"name": "user1", "status": 1},{"name": "user2", "status": 0}]},{"name":"Server 2", "status": 1,"children": [{"name": "user1", "status": 0},{"name": "user2", "status": 0}]}, {"name": "Server 3","status": 1,  "children": [{"name": "user1", "status": 0},{"name": "user2", "status": 1}]}]
    },
    {
        "name": "Project3",
        "status": 1,
        "children": [{"name": "Server 1","status": 0, "children": [{"name": "user1","status": 0},{"name": "user2", "status": 0}]},{"name":"Server 2","status": 1, "children": [{"name": "user1", "status": 0},{"name": "user2", "status": 1}]},{"name": "Server 3","status": 1, "children": [{"name": "user1", "status": 0},{"name": "user2", "status": 1}]}]
    }],
    "type": "Incident"
};

*/
// initialize the json for the tree
//DYNAMICTREE.treeJson = initialJson;

DYNAMICTREE.InitJson = function(initialJson1) {
   // console.log('passed');
   // console.log(initialJson1);
    DYNAMICTREE.treeJson = initialJson1;
};

DYNAMICTREE.getNewData = function(node) {
    /* Return a list of things that will be added as children to the json. */
    /*return [{
        name: "E",
    }, {
        name: "F",
    }];
    */
    return [];
};

DYNAMICTREE.updateJson = function(node) {
    /* Update the JSON to show new children nodes. */
    //console.log("node id", node.id);

    // Here is handy guide to how d3 works and how this code operates:
    // `._children`: this represents the *invisible* children of a node
    // `.children`: this represents the *visible* children of a node

    // if the child has children that are not currently visible, add children to each of the currently invisible nodes
   /* if (node._children) {
        node._children.forEach(function(childNode) {
            var associatedItems = DYNAMICTREE.getNewData(childNode);
            childNode._children = associatedItems;
        });
    }
    */
    // if the node has visible children, make them invisible 
    if (node.children) {
        node._children = node.children;
        node.children = null;
    }
    // if the node has invisible children, make them visible
    else {
        node.children = node._children;
        node._children = null;
    }

    // update the view to reflect the new changes
    D3UTILITY.update(node);
};