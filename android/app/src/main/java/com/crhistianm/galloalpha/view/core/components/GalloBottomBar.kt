package com.crhistianm.galloalpha.view.core.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.RowScope
import androidx.compose.material.icons.Icons
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.crhistianm.galloalpha.view.core.components.model.NavItem

@Composable
fun GalloBottomBar(startingIndex: Int = 0, itemList: List<NavItem>) {


    var selectedIndex by remember { mutableStateOf(startingIndex) }

    NavigationBar (
        containerColor = Color.Black.copy(alpha = 0.2f),
    ) {
        itemList.forEachIndexed { index, item ->
            this.NavBarItem(item, isSelected = (selectedIndex == index)) {
                selectedIndex = index
                item.onClick()
            }
        }
    }
}

@Composable
private fun RowScope.NavBarItem(
    navItem: NavItem,
    isSelected: Boolean,
    onItemClick: () -> Unit
) {
    NavigationBarItem(
        modifier = Modifier.background(color = Color.Transparent),
        selected = isSelected,
        onClick = { onItemClick() },
        icon = { Icon(painter = painterResource(navItem.icon) ,contentDescription = null) },
        label = { Text(text = navItem.name) },
        colors = NavigationBarItemDefaults.colors(
            selectedIconColor = Color.White,
            selectedTextColor = Color.White,
            indicatorColor = Color.Gray,
            unselectedIconColor = Color.White,
            unselectedTextColor = Color.White,
        )
    )

}