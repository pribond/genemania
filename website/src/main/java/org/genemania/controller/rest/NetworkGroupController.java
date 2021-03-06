/**
 * This file is part of GeneMANIA.
 * Copyright (C) 2010 University of Toronto.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

package org.genemania.controller.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.genemania.domain.InteractionNetworkGroup;
import org.genemania.domain.Organism;
import org.genemania.exception.DataStoreException;
import org.genemania.service.NetworkGroupService;
import org.genemania.service.OrganismService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class NetworkGroupController {

	// ========[ PRIVATE PROPERTIES
	// ]===============================================================

	@Autowired
	private NetworkGroupService networkGroupService;

	@Autowired
	private OrganismService organismService;

	protected final Logger logger = Logger.getLogger(getClass());

	// ========[ PUBLIC METHODS
	// ]===================================================================

	/**
	 * Return query network groups as XML.
	 * 
	 * @throws DataStoreException
	 *             when the data can not be read from the database
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/network_groups/{organismId}")
	@ResponseBody
	public Collection<InteractionNetworkGroup> list(@PathVariable Long organismId,
			@RequestParam(value = "session_id", required = false) String sessionId, HttpSession session)
					throws DataStoreException {
		logger.debug("Return Network Groups list...");

		if (sessionId == null || sessionId.isEmpty()) {
			sessionId = session.getId();
		}

		Collection<InteractionNetworkGroup> groups = networkGroupService.findNetworkGroupsByOrganism(organismId,
				sessionId);

		return groups;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/network_groups")
	@ResponseBody
	public Map<Long, Collection<InteractionNetworkGroup>> listAll(
			@RequestParam(value = "session_id", required = false) String sessionId, HttpSession session)
					throws DataStoreException {

		if (sessionId == null || sessionId.isEmpty()) {
			sessionId = session.getId();
		}

		Map<Long, Collection<InteractionNetworkGroup>> idToNetworks = new HashMap<Long, Collection<InteractionNetworkGroup>>();

		Collection<Organism> organisms = organismService.getOrganisms();

		for (Organism organism : organisms) {
			Long organismId = organism.getId();

			Collection<InteractionNetworkGroup> groups = networkGroupService.findNetworkGroupsByOrganism(organismId,
					sessionId);

			idToNetworks.put(organismId, groups);
		}

		return idToNetworks;
	}

	public NetworkGroupService getNetworkGroupService() {
		return networkGroupService;
	}

	public void setNetworkGroupService(NetworkGroupService networkGroupService) {
		this.networkGroupService = networkGroupService;
	}

	public OrganismService getOrganismService() {
		return organismService;
	}

	public void setOrganismService(OrganismService organismService) {
		this.organismService = organismService;
	}

	// show (GET), list (GET), create (POST), update (POST), delete (DELETE ?)
}
