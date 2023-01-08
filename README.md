# Interior Planner WebApp

Current version of the application can be found [here](https://home-planner-deployed.vercel.app/).

---

## How to use

Functionalities described below allow for drawing of a 
2D plan of an apartment from a top-down view.


### Setting height for all walls

To set height for all walls that will be drawn in the plan, type in the height in centimeters and click **Confirm**.

![Setting height for all walls](/readme-images/walls-height.png)


### Drawing walls

To draw wall click on **Walls** button and then click on **Add wall** button.  

Drawing a wall requires clicking once in desired starting place on the grid, after that a wall will appear on the grid but will not yet be added into the plan.  
Moving cursor around changes length and direction of drawn wall.  
To confirm drawn wall and add it to the plan simply click once again.

![Drawing walls](/readme-images/drawing-walls.gif)


### Removing walls

To remove walls click on **Walls** button and then click on **Remove wall** button.  

To remove a single wall hover over it, after it gets highlighted clicking on it will remove it from the plan.

![Removing walls](/readme-images/removing-walls.gif)


### Adding windows and doors

To add a window or a door click on **Windows and doors**, then click on **Add window and doors** and then select desired option by clicking on either **Windows** or **Doors**.  

Click on button with representation of a component and move cursor onto the plan.
Hovering on a wall with a component and then clicking will add this component to that wall.  
Arrow indicates which way component will open to, clicking once again will confirm rotation and add component into the plan.

![Adding windows and doors](/readme-images/adding-windows-and-doors.gif)


### Removing windows and doors

To remove windows and doors click on **Windows and doors**, then click on **Remove window and doors**.  

To remove window or door hover over it, after it gets highlighted clicking on it will remove it from the plan.

![Removing windows and doors](/readme-images/removing-windows-and-doors.gif)


### Adding floors and ceilings

To add floors along with ceilings click on **Floors and ceilings**, then click on **Add floor along with ceiling**.  

To start drawing a floor click on desired place on the grid, then after creating a desired shape click once again to add the floor into the plan.

![Adding floors and ceilings](/readme-images/adding-floors.gif)


### Removing floors and ceilings

To remove floors along with ceilings click on **Floors and ceilings**, then click on **Remove floor along with ceiling**.

To remove floor along with ceiling hover over it, after it gets highlighted clicking on it will remove it from the plan.

![Removing floors and ceilings](/readme-images/removing-floors.gif)


---

### Changing views between 3D and 2D

Plan created in 2D view can be rendered in a 3D view by clicking on dropdown button **View** and selecting **3D View**.  
It is also possible to change back from 3D view to 2D view in case there is a need to make some changes or add more things.

![Changing views between 3D and 2D](/readme-images/3d-2d-swap.gif)


---

Functionalities described below concern 3D view and allow adding 3D objects
and changing appearance of components that were created in a 2D view.

### Adding other 3D objects

To add an object in 3D view click on **Add or edit 3D objects** and then click on **Add 3D object**.

After an object is selected from the list it is added to the scene and can be moved into desired position.

![Adding other 3D objects](/readme-images/adding-3d-object.gif)

### Selecting 3D object to edit

To select an object in 3D view click on **Add or edit 3D objects** and then click on **Edit 3D object**.  

There are two ways of selecting an object:
 - clicking on it in the 3D scene,
 - selecting its name from the list.

![Selecting 3D object to edit](/readme-images/selecting-3d-object.gif)


### Editing 3D object

Selected object can be moved around, rotated and removed from scene.  
To move an object click on **Change position**, after that it's possible to drag an object around.  
To rotate an object click on **Change rotation**, after that it's possible to rotate object around its center.  
To remove an object click on **Remove selected 3D object**.  
It's also possible to reset position and rotation to initial values by clicking on **Reset position** or **Reset rotation**.

![Editing 3D object](/readme-images/editing-3d-object.gif)


### Editing appearance of walls, jambs, floors or ceilings

To edit appearance of a wall, jamb, floor or a ceiling click on any button corresponding to this action 
or click on a button **Edit appearance of walls, jambs, floors or ceilings**, which aggregates all of those options.  

Clicking on a desired component to edit in scene view will bring up a menu that allows for changing color, texture and texture rotation.  
Selected component will be highlighted making its color much brighter, clicking on **Disable highlighting** will remove highlighting from the color.

![Editing appearance of walls, jambs, floors or ceilings](/readme-images/editing-walls-etc.gif)
