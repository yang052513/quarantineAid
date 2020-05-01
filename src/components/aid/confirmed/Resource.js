import React from "react"
import resourceData from "../../../data/resourceData"
import ResourceItem from "./ResourceItem"
function Resource() {
  const resourceComponent = resourceData.map((item) => (
    <ResourceItem key={item.id} resource={item} />
  ))
  return (
    <div className="resource-container">
      <h2>Resource</h2>
      {resourceComponent}
    </div>
  )
}

export default Resource
