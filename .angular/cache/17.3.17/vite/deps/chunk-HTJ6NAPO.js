import {
  SelectionModel,
  isDataSource
} from "./chunk-UYUYVSI3.js";
import {
  Directionality
} from "./chunk-XN6ECUPF.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  IterableDiffers,
  NgModule,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation$1,
  booleanAttribute,
  numberAttribute,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵattribute,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementContainer,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-NIR7YTS7.js";
import {
  isObservable
} from "./chunk-4RMHXXWK.js";
import {
  BehaviorSubject,
  Subject,
  filter,
  of,
  take,
  takeUntil
} from "./chunk-AJN3JCM6.js";

// node_modules/@angular/cdk/fesm2022/tree.mjs
var BaseTreeControl = class {
  constructor() {
    this.expansionModel = new SelectionModel(true);
  }
  /** Toggles one single data node's expanded/collapsed state. */
  toggle(dataNode) {
    this.expansionModel.toggle(this._trackByValue(dataNode));
  }
  /** Expands one single data node. */
  expand(dataNode) {
    this.expansionModel.select(this._trackByValue(dataNode));
  }
  /** Collapses one single data node. */
  collapse(dataNode) {
    this.expansionModel.deselect(this._trackByValue(dataNode));
  }
  /** Whether a given data node is expanded or not. Returns true if the data node is expanded. */
  isExpanded(dataNode) {
    return this.expansionModel.isSelected(this._trackByValue(dataNode));
  }
  /** Toggles a subtree rooted at `node` recursively. */
  toggleDescendants(dataNode) {
    this.expansionModel.isSelected(this._trackByValue(dataNode)) ? this.collapseDescendants(dataNode) : this.expandDescendants(dataNode);
  }
  /** Collapse all dataNodes in the tree. */
  collapseAll() {
    this.expansionModel.clear();
  }
  /** Expands a subtree rooted at given data node recursively. */
  expandDescendants(dataNode) {
    let toBeProcessed = [dataNode];
    toBeProcessed.push(...this.getDescendants(dataNode));
    this.expansionModel.select(...toBeProcessed.map((value) => this._trackByValue(value)));
  }
  /** Collapses a subtree rooted at given data node recursively. */
  collapseDescendants(dataNode) {
    let toBeProcessed = [dataNode];
    toBeProcessed.push(...this.getDescendants(dataNode));
    this.expansionModel.deselect(...toBeProcessed.map((value) => this._trackByValue(value)));
  }
  _trackByValue(value) {
    return this.trackBy ? this.trackBy(value) : value;
  }
};
var FlatTreeControl = class extends BaseTreeControl {
  /** Construct with flat tree data node functions getLevel and isExpandable. */
  constructor(getLevel, isExpandable, options) {
    super();
    this.getLevel = getLevel;
    this.isExpandable = isExpandable;
    this.options = options;
    if (this.options) {
      this.trackBy = this.options.trackBy;
    }
  }
  /**
   * Gets a list of the data node's subtree of descendent data nodes.
   *
   * To make this working, the `dataNodes` of the TreeControl must be flattened tree nodes
   * with correct levels.
   */
  getDescendants(dataNode) {
    const startIndex = this.dataNodes.indexOf(dataNode);
    const results = [];
    for (let i = startIndex + 1; i < this.dataNodes.length && this.getLevel(dataNode) < this.getLevel(this.dataNodes[i]); i++) {
      results.push(this.dataNodes[i]);
    }
    return results;
  }
  /**
   * Expands all data nodes in the tree.
   *
   * To make this working, the `dataNodes` variable of the TreeControl must be set to all flattened
   * data nodes of the tree.
   */
  expandAll() {
    this.expansionModel.select(...this.dataNodes.map((node) => this._trackByValue(node)));
  }
};
var NestedTreeControl = class extends BaseTreeControl {
  /** Construct with nested tree function getChildren. */
  constructor(getChildren, options) {
    super();
    this.getChildren = getChildren;
    this.options = options;
    if (this.options) {
      this.trackBy = this.options.trackBy;
    }
  }
  /**
   * Expands all dataNodes in the tree.
   *
   * To make this working, the `dataNodes` variable of the TreeControl must be set to all root level
   * data nodes of the tree.
   */
  expandAll() {
    this.expansionModel.clear();
    const allNodes = this.dataNodes.reduce((accumulator, dataNode) => [...accumulator, ...this.getDescendants(dataNode), dataNode], []);
    this.expansionModel.select(...allNodes.map((node) => this._trackByValue(node)));
  }
  /** Gets a list of descendant dataNodes of a subtree rooted at given data node recursively. */
  getDescendants(dataNode) {
    const descendants = [];
    this._getDescendants(descendants, dataNode);
    return descendants.splice(1);
  }
  /** A helper function to get descendants recursively. */
  _getDescendants(descendants, dataNode) {
    descendants.push(dataNode);
    const childrenNodes = this.getChildren(dataNode);
    if (Array.isArray(childrenNodes)) {
      childrenNodes.forEach((child) => this._getDescendants(descendants, child));
    } else if (isObservable(childrenNodes)) {
      childrenNodes.pipe(take(1), filter(Boolean)).subscribe((children) => {
        for (const child of children) {
          this._getDescendants(descendants, child);
        }
      });
    }
  }
};
var CDK_TREE_NODE_OUTLET_NODE = new InjectionToken("CDK_TREE_NODE_OUTLET_NODE");
var CdkTreeNodeOutlet = class _CdkTreeNodeOutlet {
  constructor(viewContainer, _node) {
    this.viewContainer = viewContainer;
    this._node = _node;
  }
  static {
    this.ɵfac = function CdkTreeNodeOutlet_Factory(t) {
      return new (t || _CdkTreeNodeOutlet)(ɵɵdirectiveInject(ViewContainerRef), ɵɵdirectiveInject(CDK_TREE_NODE_OUTLET_NODE, 8));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkTreeNodeOutlet,
      selectors: [["", "cdkTreeNodeOutlet", ""]],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeNodeOutlet, [{
    type: Directive,
    args: [{
      selector: "[cdkTreeNodeOutlet]",
      standalone: true
    }]
  }], () => [{
    type: ViewContainerRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [CDK_TREE_NODE_OUTLET_NODE]
    }, {
      type: Optional
    }]
  }], null);
})();
var CdkTreeNodeOutletContext = class {
  constructor(data) {
    this.$implicit = data;
  }
};
var CdkTreeNodeDef = class _CdkTreeNodeDef {
  /** @docs-private */
  constructor(template) {
    this.template = template;
  }
  static {
    this.ɵfac = function CdkTreeNodeDef_Factory(t) {
      return new (t || _CdkTreeNodeDef)(ɵɵdirectiveInject(TemplateRef));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkTreeNodeDef,
      selectors: [["", "cdkTreeNodeDef", ""]],
      inputs: {
        when: [InputFlags.None, "cdkTreeNodeDefWhen", "when"]
      },
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeNodeDef, [{
    type: Directive,
    args: [{
      selector: "[cdkTreeNodeDef]",
      inputs: [{
        name: "when",
        alias: "cdkTreeNodeDefWhen"
      }],
      standalone: true
    }]
  }], () => [{
    type: TemplateRef
  }], null);
})();
function getTreeNoValidDataSourceError() {
  return Error(`A valid data source must be provided.`);
}
function getTreeMultipleDefaultNodeDefsError() {
  return Error(`There can only be one default row without a when predicate function.`);
}
function getTreeMissingMatchingNodeDefError() {
  return Error(`Could not find a matching node definition for the provided node data.`);
}
function getTreeControlMissingError() {
  return Error(`Could not find a tree control for the tree.`);
}
function getTreeControlFunctionsMissingError() {
  return Error(`Could not find functions for nested/flat tree in tree control.`);
}
var CdkTree = class _CdkTree {
  /**
   * Provides a stream containing the latest data array to render. Influenced by the tree's
   * stream of view window (what dataNodes are currently on screen).
   * Data source can be an observable of data array, or a data array to render.
   */
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(dataSource) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  constructor(_differs, _changeDetectorRef) {
    this._differs = _differs;
    this._changeDetectorRef = _changeDetectorRef;
    this._onDestroy = new Subject();
    this._levels = /* @__PURE__ */ new Map();
    this.viewChange = new BehaviorSubject({
      start: 0,
      end: Number.MAX_VALUE
    });
  }
  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create(this.trackBy);
    if (!this.treeControl && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTreeControlMissingError();
    }
  }
  ngOnDestroy() {
    this._nodeOutlet.viewContainer.clear();
    this.viewChange.complete();
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this._dataSource && typeof this._dataSource.disconnect === "function") {
      this.dataSource.disconnect(this);
    }
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }
  }
  ngAfterContentChecked() {
    const defaultNodeDefs = this._nodeDefs.filter((def) => !def.when);
    if (defaultNodeDefs.length > 1 && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTreeMultipleDefaultNodeDefsError();
    }
    this._defaultNodeDef = defaultNodeDefs[0];
    if (this.dataSource && this._nodeDefs && !this._dataSubscription) {
      this._observeRenderChanges();
    }
  }
  // TODO(tinayuangao): Work on keyboard traversal and actions, make sure it's working for RTL
  //     and nested trees.
  /**
   * Switch to the provided data source by resetting the data and unsubscribing from the current
   * render change subscription if one exists. If the data source is null, interpret this by
   * clearing the node outlet. Otherwise start listening for new data.
   */
  _switchDataSource(dataSource) {
    if (this._dataSource && typeof this._dataSource.disconnect === "function") {
      this.dataSource.disconnect(this);
    }
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }
    if (!dataSource) {
      this._nodeOutlet.viewContainer.clear();
    }
    this._dataSource = dataSource;
    if (this._nodeDefs) {
      this._observeRenderChanges();
    }
  }
  /** Set up a subscription for the data provided by the data source. */
  _observeRenderChanges() {
    let dataStream;
    if (isDataSource(this._dataSource)) {
      dataStream = this._dataSource.connect(this);
    } else if (isObservable(this._dataSource)) {
      dataStream = this._dataSource;
    } else if (Array.isArray(this._dataSource)) {
      dataStream = of(this._dataSource);
    }
    if (dataStream) {
      this._dataSubscription = dataStream.pipe(takeUntil(this._onDestroy)).subscribe((data) => this.renderNodeChanges(data));
    } else if (typeof ngDevMode === "undefined" || ngDevMode) {
      throw getTreeNoValidDataSourceError();
    }
  }
  /** Check for changes made in the data and render each change (node added/removed/moved). */
  renderNodeChanges(data, dataDiffer = this._dataDiffer, viewContainer = this._nodeOutlet.viewContainer, parentData) {
    const changes = dataDiffer.diff(data);
    if (!changes) {
      return;
    }
    changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
      if (item.previousIndex == null) {
        this.insertNode(data[currentIndex], currentIndex, viewContainer, parentData);
      } else if (currentIndex == null) {
        viewContainer.remove(adjustedPreviousIndex);
        this._levels.delete(item.item);
      } else {
        const view = viewContainer.get(adjustedPreviousIndex);
        viewContainer.move(view, currentIndex);
      }
    });
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Finds the matching node definition that should be used for this node data. If there is only
   * one node definition, it is returned. Otherwise, find the node definition that has a when
   * predicate that returns true with the data. If none return true, return the default node
   * definition.
   */
  _getNodeDef(data, i) {
    if (this._nodeDefs.length === 1) {
      return this._nodeDefs.first;
    }
    const nodeDef = this._nodeDefs.find((def) => def.when && def.when(i, data)) || this._defaultNodeDef;
    if (!nodeDef && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTreeMissingMatchingNodeDefError();
    }
    return nodeDef;
  }
  /**
   * Create the embedded view for the data node template and place it in the correct index location
   * within the data node view container.
   */
  insertNode(nodeData, index, viewContainer, parentData) {
    const node = this._getNodeDef(nodeData, index);
    const context = new CdkTreeNodeOutletContext(nodeData);
    if (this.treeControl.getLevel) {
      context.level = this.treeControl.getLevel(nodeData);
    } else if (typeof parentData !== "undefined" && this._levels.has(parentData)) {
      context.level = this._levels.get(parentData) + 1;
    } else {
      context.level = 0;
    }
    this._levels.set(nodeData, context.level);
    const container = viewContainer ? viewContainer : this._nodeOutlet.viewContainer;
    container.createEmbeddedView(node.template, context, index);
    if (CdkTreeNode.mostRecentTreeNode) {
      CdkTreeNode.mostRecentTreeNode.data = nodeData;
    }
  }
  static {
    this.ɵfac = function CdkTree_Factory(t) {
      return new (t || _CdkTree)(ɵɵdirectiveInject(IterableDiffers), ɵɵdirectiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _CdkTree,
      selectors: [["cdk-tree"]],
      contentQueries: function CdkTree_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, CdkTreeNodeDef, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._nodeDefs = _t);
        }
      },
      viewQuery: function CdkTree_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(CdkTreeNodeOutlet, 7);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._nodeOutlet = _t.first);
        }
      },
      hostAttrs: ["role", "tree", 1, "cdk-tree"],
      inputs: {
        dataSource: "dataSource",
        treeControl: "treeControl",
        trackBy: "trackBy"
      },
      exportAs: ["cdkTree"],
      standalone: true,
      features: [ɵɵStandaloneFeature],
      decls: 1,
      vars: 0,
      consts: [["cdkTreeNodeOutlet", ""]],
      template: function CdkTree_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelementContainer(0, 0);
        }
      },
      dependencies: [CdkTreeNodeOutlet],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTree, [{
    type: Component,
    args: [{
      selector: "cdk-tree",
      exportAs: "cdkTree",
      template: `<ng-container cdkTreeNodeOutlet></ng-container>`,
      host: {
        "class": "cdk-tree",
        "role": "tree"
      },
      encapsulation: ViewEncapsulation$1.None,
      // The "OnPush" status for the `CdkTree` component is effectively a noop, so we are removing it.
      // The view for `CdkTree` consists entirely of templates declared in other views. As they are
      // declared elsewhere, they are checked when their declaration points are checked.
      // tslint:disable-next-line:validate-decorators
      changeDetection: ChangeDetectionStrategy.Default,
      standalone: true,
      imports: [CdkTreeNodeOutlet]
    }]
  }], () => [{
    type: IterableDiffers
  }, {
    type: ChangeDetectorRef
  }], {
    dataSource: [{
      type: Input
    }],
    treeControl: [{
      type: Input
    }],
    trackBy: [{
      type: Input
    }],
    _nodeOutlet: [{
      type: ViewChild,
      args: [CdkTreeNodeOutlet, {
        static: true
      }]
    }],
    _nodeDefs: [{
      type: ContentChildren,
      args: [CdkTreeNodeDef, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();
var CdkTreeNode = class _CdkTreeNode {
  /**
   * The role of the tree node.
   * @deprecated The correct role is 'treeitem', 'group' should not be used. This input will be
   *   removed in a future version.
   * @breaking-change 12.0.0 Remove this input
   */
  get role() {
    return "treeitem";
  }
  set role(_role) {
    this._elementRef.nativeElement.setAttribute("role", _role);
  }
  static {
    this.mostRecentTreeNode = null;
  }
  /** The tree node's data. */
  get data() {
    return this._data;
  }
  set data(value) {
    if (value !== this._data) {
      this._data = value;
      this._setRoleFromData();
      this._dataChanges.next();
    }
  }
  get isExpanded() {
    return this._tree.treeControl.isExpanded(this._data);
  }
  get level() {
    return this._tree.treeControl.getLevel ? this._tree.treeControl.getLevel(this._data) : this._parentNodeAriaLevel;
  }
  constructor(_elementRef, _tree) {
    this._elementRef = _elementRef;
    this._tree = _tree;
    this._destroyed = new Subject();
    this._dataChanges = new Subject();
    _CdkTreeNode.mostRecentTreeNode = this;
    this.role = "treeitem";
  }
  ngOnInit() {
    this._parentNodeAriaLevel = getParentNodeAriaLevel(this._elementRef.nativeElement);
    this._elementRef.nativeElement.setAttribute("aria-level", `${this.level + 1}`);
  }
  ngOnDestroy() {
    if (_CdkTreeNode.mostRecentTreeNode === this) {
      _CdkTreeNode.mostRecentTreeNode = null;
    }
    this._dataChanges.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Focuses the menu item. Implements for FocusableOption. */
  focus() {
    this._elementRef.nativeElement.focus();
  }
  // TODO: role should eventually just be set in the component host
  _setRoleFromData() {
    if (!this._tree.treeControl.isExpandable && !this._tree.treeControl.getChildren && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTreeControlFunctionsMissingError();
    }
    this.role = "treeitem";
  }
  static {
    this.ɵfac = function CdkTreeNode_Factory(t) {
      return new (t || _CdkTreeNode)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(CdkTree));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkTreeNode,
      selectors: [["cdk-tree-node"]],
      hostAttrs: [1, "cdk-tree-node"],
      hostVars: 1,
      hostBindings: function CdkTreeNode_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("aria-expanded", ctx.isExpanded);
        }
      },
      inputs: {
        role: "role"
      },
      exportAs: ["cdkTreeNode"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeNode, [{
    type: Directive,
    args: [{
      selector: "cdk-tree-node",
      exportAs: "cdkTreeNode",
      host: {
        "class": "cdk-tree-node",
        "[attr.aria-expanded]": "isExpanded"
      },
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: CdkTree
  }], {
    role: [{
      type: Input
    }]
  });
})();
function getParentNodeAriaLevel(nodeElement) {
  let parent = nodeElement.parentElement;
  while (parent && !isNodeElement(parent)) {
    parent = parent.parentElement;
  }
  if (!parent) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      throw Error("Incorrect tree structure containing detached node.");
    } else {
      return -1;
    }
  } else if (parent.classList.contains("cdk-nested-tree-node")) {
    return numberAttribute(parent.getAttribute("aria-level"));
  } else {
    return 0;
  }
}
function isNodeElement(element) {
  const classList = element.classList;
  return !!(classList?.contains("cdk-nested-tree-node") || classList?.contains("cdk-tree"));
}
var CdkNestedTreeNode = class _CdkNestedTreeNode extends CdkTreeNode {
  constructor(elementRef, tree, _differs) {
    super(elementRef, tree);
    this._differs = _differs;
  }
  ngAfterContentInit() {
    this._dataDiffer = this._differs.find([]).create(this._tree.trackBy);
    if (!this._tree.treeControl.getChildren && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTreeControlFunctionsMissingError();
    }
    const childrenNodes = this._tree.treeControl.getChildren(this.data);
    if (Array.isArray(childrenNodes)) {
      this.updateChildrenNodes(childrenNodes);
    } else if (isObservable(childrenNodes)) {
      childrenNodes.pipe(takeUntil(this._destroyed)).subscribe((result) => this.updateChildrenNodes(result));
    }
    this.nodeOutlet.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this.updateChildrenNodes());
  }
  // This is a workaround for https://github.com/angular/angular/issues/23091
  // In aot mode, the lifecycle hooks from parent class are not called.
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    this._clear();
    super.ngOnDestroy();
  }
  /** Add children dataNodes to the NodeOutlet */
  updateChildrenNodes(children) {
    const outlet = this._getNodeOutlet();
    if (children) {
      this._children = children;
    }
    if (outlet && this._children) {
      const viewContainer = outlet.viewContainer;
      this._tree.renderNodeChanges(this._children, this._dataDiffer, viewContainer, this._data);
    } else {
      this._dataDiffer.diff([]);
    }
  }
  /** Clear the children dataNodes. */
  _clear() {
    const outlet = this._getNodeOutlet();
    if (outlet) {
      outlet.viewContainer.clear();
      this._dataDiffer.diff([]);
    }
  }
  /** Gets the outlet for the current node. */
  _getNodeOutlet() {
    const outlets = this.nodeOutlet;
    return outlets && outlets.find((outlet) => !outlet._node || outlet._node === this);
  }
  static {
    this.ɵfac = function CdkNestedTreeNode_Factory(t) {
      return new (t || _CdkNestedTreeNode)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(CdkTree), ɵɵdirectiveInject(IterableDiffers));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkNestedTreeNode,
      selectors: [["cdk-nested-tree-node"]],
      contentQueries: function CdkNestedTreeNode_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, CdkTreeNodeOutlet, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nodeOutlet = _t);
        }
      },
      hostAttrs: [1, "cdk-nested-tree-node"],
      exportAs: ["cdkNestedTreeNode"],
      standalone: true,
      features: [ɵɵProvidersFeature([{
        provide: CdkTreeNode,
        useExisting: _CdkNestedTreeNode
      }, {
        provide: CDK_TREE_NODE_OUTLET_NODE,
        useExisting: _CdkNestedTreeNode
      }]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkNestedTreeNode, [{
    type: Directive,
    args: [{
      selector: "cdk-nested-tree-node",
      exportAs: "cdkNestedTreeNode",
      providers: [{
        provide: CdkTreeNode,
        useExisting: CdkNestedTreeNode
      }, {
        provide: CDK_TREE_NODE_OUTLET_NODE,
        useExisting: CdkNestedTreeNode
      }],
      host: {
        "class": "cdk-nested-tree-node"
      },
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: CdkTree
  }, {
    type: IterableDiffers
  }], {
    nodeOutlet: [{
      type: ContentChildren,
      args: [CdkTreeNodeOutlet, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();
var cssUnitPattern = /([A-Za-z%]+)$/;
var CdkTreeNodePadding = class _CdkTreeNodePadding {
  /** The level of depth of the tree node. The padding will be `level * indent` pixels. */
  get level() {
    return this._level;
  }
  set level(value) {
    this._setLevelInput(value);
  }
  /**
   * The indent for each level. Can be a number or a CSS string.
   * Default number 40px from material design menu sub-menu spec.
   */
  get indent() {
    return this._indent;
  }
  set indent(indent) {
    this._setIndentInput(indent);
  }
  constructor(_treeNode, _tree, _element, _dir) {
    this._treeNode = _treeNode;
    this._tree = _tree;
    this._element = _element;
    this._dir = _dir;
    this._destroyed = new Subject();
    this.indentUnits = "px";
    this._indent = 40;
    this._setPadding();
    if (_dir) {
      _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => this._setPadding(true));
    }
    _treeNode._dataChanges.subscribe(() => this._setPadding());
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** The padding indent value for the tree node. Returns a string with px numbers if not null. */
  _paddingIndent() {
    const nodeLevel = this._treeNode.data && this._tree.treeControl.getLevel ? this._tree.treeControl.getLevel(this._treeNode.data) : null;
    const level = this._level == null ? nodeLevel : this._level;
    return typeof level === "number" ? `${level * this._indent}${this.indentUnits}` : null;
  }
  _setPadding(forceChange = false) {
    const padding = this._paddingIndent();
    if (padding !== this._currentPadding || forceChange) {
      const element = this._element.nativeElement;
      const paddingProp = this._dir && this._dir.value === "rtl" ? "paddingRight" : "paddingLeft";
      const resetProp = paddingProp === "paddingLeft" ? "paddingRight" : "paddingLeft";
      element.style[paddingProp] = padding || "";
      element.style[resetProp] = "";
      this._currentPadding = padding;
    }
  }
  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  _setLevelInput(value) {
    this._level = isNaN(value) ? null : value;
    this._setPadding();
  }
  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  _setIndentInput(indent) {
    let value = indent;
    let units = "px";
    if (typeof indent === "string") {
      const parts = indent.split(cssUnitPattern);
      value = parts[0];
      units = parts[1] || units;
    }
    this.indentUnits = units;
    this._indent = numberAttribute(value);
    this._setPadding();
  }
  static {
    this.ɵfac = function CdkTreeNodePadding_Factory(t) {
      return new (t || _CdkTreeNodePadding)(ɵɵdirectiveInject(CdkTreeNode), ɵɵdirectiveInject(CdkTree), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Directionality, 8));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkTreeNodePadding,
      selectors: [["", "cdkTreeNodePadding", ""]],
      inputs: {
        level: [InputFlags.HasDecoratorInputTransform, "cdkTreeNodePadding", "level", numberAttribute],
        indent: [InputFlags.None, "cdkTreeNodePaddingIndent", "indent"]
      },
      standalone: true,
      features: [ɵɵInputTransformsFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeNodePadding, [{
    type: Directive,
    args: [{
      selector: "[cdkTreeNodePadding]",
      standalone: true
    }]
  }], () => [{
    type: CdkTreeNode
  }, {
    type: CdkTree
  }, {
    type: ElementRef
  }, {
    type: Directionality,
    decorators: [{
      type: Optional
    }]
  }], {
    level: [{
      type: Input,
      args: [{
        alias: "cdkTreeNodePadding",
        transform: numberAttribute
      }]
    }],
    indent: [{
      type: Input,
      args: ["cdkTreeNodePaddingIndent"]
    }]
  });
})();
var CdkTreeNodeToggle = class _CdkTreeNodeToggle {
  constructor(_tree, _treeNode) {
    this._tree = _tree;
    this._treeNode = _treeNode;
    this.recursive = false;
  }
  _toggle(event) {
    this.recursive ? this._tree.treeControl.toggleDescendants(this._treeNode.data) : this._tree.treeControl.toggle(this._treeNode.data);
    event.stopPropagation();
  }
  static {
    this.ɵfac = function CdkTreeNodeToggle_Factory(t) {
      return new (t || _CdkTreeNodeToggle)(ɵɵdirectiveInject(CdkTree), ɵɵdirectiveInject(CdkTreeNode));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _CdkTreeNodeToggle,
      selectors: [["", "cdkTreeNodeToggle", ""]],
      hostBindings: function CdkTreeNodeToggle_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click", function CdkTreeNodeToggle_click_HostBindingHandler($event) {
            return ctx._toggle($event);
          });
        }
      },
      inputs: {
        recursive: [InputFlags.HasDecoratorInputTransform, "cdkTreeNodeToggleRecursive", "recursive", booleanAttribute]
      },
      standalone: true,
      features: [ɵɵInputTransformsFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeNodeToggle, [{
    type: Directive,
    args: [{
      selector: "[cdkTreeNodeToggle]",
      host: {
        "(click)": "_toggle($event)"
      },
      standalone: true
    }]
  }], () => [{
    type: CdkTree
  }, {
    type: CdkTreeNode
  }], {
    recursive: [{
      type: Input,
      args: [{
        alias: "cdkTreeNodeToggleRecursive",
        transform: booleanAttribute
      }]
    }]
  });
})();
var EXPORTED_DECLARATIONS = [CdkNestedTreeNode, CdkTreeNodeDef, CdkTreeNodePadding, CdkTreeNodeToggle, CdkTree, CdkTreeNode, CdkTreeNodeOutlet];
var CdkTreeModule = class _CdkTreeModule {
  static {
    this.ɵfac = function CdkTreeModule_Factory(t) {
      return new (t || _CdkTreeModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _CdkTreeModule,
      imports: [CdkNestedTreeNode, CdkTreeNodeDef, CdkTreeNodePadding, CdkTreeNodeToggle, CdkTree, CdkTreeNode, CdkTreeNodeOutlet],
      exports: [CdkNestedTreeNode, CdkTreeNodeDef, CdkTreeNodePadding, CdkTreeNodeToggle, CdkTree, CdkTreeNode, CdkTreeNodeOutlet]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTreeModule, [{
    type: NgModule,
    args: [{
      imports: EXPORTED_DECLARATIONS,
      exports: EXPORTED_DECLARATIONS
    }]
  }], null, null);
})();

export {
  BaseTreeControl,
  FlatTreeControl,
  NestedTreeControl,
  CDK_TREE_NODE_OUTLET_NODE,
  CdkTreeNodeOutlet,
  CdkTreeNodeOutletContext,
  CdkTreeNodeDef,
  getTreeNoValidDataSourceError,
  getTreeMultipleDefaultNodeDefsError,
  getTreeMissingMatchingNodeDefError,
  getTreeControlMissingError,
  getTreeControlFunctionsMissingError,
  CdkTree,
  CdkTreeNode,
  CdkNestedTreeNode,
  CdkTreeNodePadding,
  CdkTreeNodeToggle,
  CdkTreeModule
};
//# sourceMappingURL=chunk-HTJ6NAPO.js.map
