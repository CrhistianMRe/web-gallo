package com.crhistianm.galloalpha.view.persistence.load

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.FabPosition
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.crhistianm.galloalpha.R
import com.crhistianm.galloalpha.data.response.WorkoutResponse
import com.crhistianm.galloalpha.view.core.components.GalloBottomBar
import com.crhistianm.galloalpha.view.core.components.GalloCard
import com.crhistianm.galloalpha.view.core.components.GalloTopAppBar
import com.crhistianm.galloalpha.view.core.components.model.NavItem
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@Composable
@Preview
fun WorkoutListScreen(
    viewModel: WorkoutListViewModel = hiltViewModel()
) {

    val listState: LazyListState = rememberLazyListState()
    val coroutineScope: CoroutineScope = rememberCoroutineScope()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()


    LaunchedEffect(Unit) {
        viewModel.loadWorkoutList()
    }

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
                GalloTopAppBar(title = "Workout List", navigationIcon = {}) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowUp,
                        contentDescription = "Calendar image",
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
            bottomBar = {
                GalloBottomBar(
                    startingIndex = 0,
                    itemList = listOf (
                        NavItem(
                            name = "Workouts",
                            icon = R.drawable.icon_workout
                        )
                    )
                )
            }

        ) { innerPadding ->
            when(uiState.isLoading){
                true ->{
                    //Loading animation
                }
                false ->{
                    LazyColumn (
                        modifier = Modifier.padding(innerPadding).fillMaxSize(),
                        state = listState,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        items(uiState.workoutList) { workout ->
                            GalloCard(
                                topText = workout.exerciseName,
                                primaryText = workout.workoutDate,
                                bottomText = workout.workoutLength,
                                imageUrl = workout.imageUrl
                            )
                            Spacer(modifier = Modifier.height(20.dp))
                            HorizontalDivider()
                            Spacer(modifier = Modifier.height(20.dp))
                        }
                    }
                }
            }

        }
    }


}


