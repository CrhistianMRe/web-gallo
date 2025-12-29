package com.crhistianm.galloalpha.view.core.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.FabPosition
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch


@Composable
fun GalloMainLayout(
    title: String = "",
    bottomBar: @Composable () -> Unit,
    content: @Composable (PaddingValues, LazyListState) -> Unit
) {

    val listState: LazyListState = rememberLazyListState()
    val coroutineScope: CoroutineScope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colorStops = arrayOf(
                        0.2f to Color(0xFF131212),
                        0.6f to Color.Black,
                    )
                )
            )
    ) {
        Scaffold (
            modifier = Modifier
                .fillMaxSize(),
            floatingActionButtonPosition = FabPosition.Center,
            containerColor = Color.Transparent,
            contentColor = Color.Transparent,
            floatingActionButton = {
                /*GalloFloatingButton(
                    onClick = {}
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Add icon image",
                        modifier = Modifier.size(40.dp)
                    )
                }*/
            },
            topBar = {
                GalloTopAppBar(title = title, navigationIcon = {}) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowUp,
                        contentDescription = "Up arrow icon",
                        tint = Color.White,
                        modifier = Modifier
                            .size(39.dp)
                            .padding(end = 5.dp)
                            .clickable{
                                coroutineScope.launch {
                                    listState.animateScrollToItem(0)
                                }
                            }
                    )
                }
            },
            bottomBar = { bottomBar() }

        ) { innerPadding ->
            content(innerPadding, listState)
        }
    }
}