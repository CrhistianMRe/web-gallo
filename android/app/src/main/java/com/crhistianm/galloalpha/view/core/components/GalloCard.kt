package com.crhistianm.galloalpha.view.core.components

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.ImageLoader
import coil3.compose.AsyncImage
import coil3.network.okhttp.OkHttpNetworkFetcherFactory
import coil3.request.ImageRequest
import coil3.request.crossfade
import com.crhistianm.galloalpha.R
import okhttp3.OkHttpClient

@Composable
fun GalloCard(
    modifier: Modifier = Modifier.size(400.dp, 100.dp),
    topText: String = "",
    bottomText: String = "",
    primaryText: String = "",
    imageUrl: String
) {
    val context = LocalContext.current


    val imageLoader = ImageLoader.Builder(context)
        .components {
            add(
                OkHttpNetworkFetcherFactory(
                    callFactory = {
                        OkHttpClient.Builder()
                            .followRedirects(true)
                            .followSslRedirects(true)
                            // This header will be added to every image request.
                            .build()
                    },
                )
            )
        }
        .crossfade(true)
        .build()



    Card (
        colors = CardDefaults.cardColors(
            containerColor = Color.Transparent,
            contentColor = Color.White
        ),
        modifier = modifier.background(
            alpha = 0.3f,
            brush = Brush.verticalGradient(listOf(Color.White, Color.Transparent)),
            shape = RoundedCornerShape(40f)
        )
            .border(
                width = 1.dp,
                shape = RoundedCornerShape(50f),
                color = Color.White.copy(alpha = 0.5f)
            )
    ) {
        Column {
            Row {
                Text(
                    modifier = Modifier.fillMaxWidth()
                        .padding(start = 10.dp),
                    text = topText,
                    textAlign = TextAlign.Start,
                    fontSize = 20.sp
                )
            }

            HorizontalDivider()

            Row {
                Box(
                    modifier = Modifier
                        .padding(top = 7.dp, start = 10.dp)
                        .size(50.dp)
                        .background(
                            color = Color.White.copy(alpha = 0.1f),
                            shape = RoundedCornerShape(30f)
                        )
                ) {
                    AsyncImage(
                        model = imageUrl,
                        imageLoader = imageLoader,
                        contentDescription = null,
                        modifier = Modifier.matchParentSize(),
                        placeholder = painterResource(R.drawable.icon_exercise),
                        error = painterResource(R.drawable.icon_time),
                        onError = {Log.i("IMG", "${it.result.throwable.message} image url=$imageUrl")}
                    )
                }

                Column (
                    modifier = Modifier.padding(start = 100.dp)
                ){
                    Text(
                        text = primaryText,
                        fontSize = 14.sp,
                    )
                    Spacer(Modifier.height(10.dp))
                    Row {
                        if(bottomText.isNotEmpty()){
                            Icon(painter = painterResource(R.drawable.icon_time), contentDescription = null, tint = Color.Gray)
                            Text(text = " $bottomText", fontSize = 18.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}

@Composable
@Preview
private fun GalloCardPreview(){
    GalloCard (
        modifier = Modifier
            .width(200.dp)
            .height(50.dp),
        primaryText = "Top",
        imageUrl = "https://avatars.githubusercontent.com/u/106357444?v=4"
    )
}

