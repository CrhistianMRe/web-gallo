package com.crhistianm.galloalpha.view.persistence.load

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.crhistianm.galloalpha.R
import com.crhistianm.galloalpha.view.core.components.GalloBottomBar
import com.crhistianm.galloalpha.view.core.components.GalloCard
import com.crhistianm.galloalpha.view.core.components.GalloMainLayout
import com.crhistianm.galloalpha.view.core.components.model.NavItem
import com.crhistianm.galloalpha.view.core.navigation.Screens
import kotlinx.coroutines.CoroutineScope

@Composable
fun ExerciseListScreen (
    viewModel: ExerciseListViewModel = hiltViewModel(),
    navigateToWorkout: () -> Unit
) {

    val uiState: ExerciseUiState by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) { viewModel.loadExerciseList() }

    GalloMainLayout(
        title = "Exercise List",
        bottomBar = {
            GalloBottomBar(
                startingIndex = 1,
                itemList = listOf (
                    NavItem(
                        name = "Workouts",
                        icon = R.drawable.icon_workout,
                        onClick = { navigateToWorkout() }
                    ),
                    NavItem(
                        name = "Exercises",
                        icon = R.drawable.icon_exercise
                    )
                )
            )
        },
    ) { innerPadding, listState ->

        when(uiState.isLoading){
            false-> {
                LazyColumn (
                    modifier = Modifier.padding(innerPadding),
                    state = listState,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    items(uiState.exerciseList) { exercise ->
                        GalloCard (
                            modifier = Modifier.fillMaxWidth().height(100.dp),
                            topText = exercise.exerciseName,
                            primaryText = exercise.exerciseDescription,
                            imageUrl = exercise.imageUrl,
                        )
                    }

                }

            }
            true-> { /*Lottie loading animation*/}
        }

    }

}