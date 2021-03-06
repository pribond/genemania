package org.genemania.adminweb.web.model;

public class AttributesFolderTN extends TreeNode {
    public static final String NODETYPE = "attributes_folder_node";

    private int organismId;

    public AttributesFolderTN(String title) {
        super(title);
        setFolder(true);
        setType(NODETYPE);
    }

    @Override
    public String getKey() {
        return String.format("o=%d:attributesFolder", getOrganismId());
    }

	public int getOrganismId() {
		return organismId;
	}

	public void setOrganismId(int organismId) {
		this.organismId = organismId;
	}
}
