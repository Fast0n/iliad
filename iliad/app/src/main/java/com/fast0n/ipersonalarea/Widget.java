package com.fast0n.ipersonalarea;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.widget.RemoteViews;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.AppWidgetTarget;
import com.bumptech.glide.request.transition.Transition;
import com.fast0n.ipersonalarea.java.GenerateToken;

import org.json.JSONException;
import org.json.JSONObject;

import static android.view.View.VISIBLE;


public class Widget extends AppWidgetProvider {


    String token = GenerateToken.randomString(20);

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {

            RequestOptions options = new RequestOptions().override(50, 50);
            RemoteViews views = new RemoteViews(context.getPackageName(),
                    R.layout.widget);


            Intent iSetting = new Intent(context, LoginActivity.class);
            PendingIntent piSetting = PendingIntent.getActivity(context, 0, iSetting, 0);
            views.setOnClickPendingIntent(R.id.widget_click, piSetting);


            AppWidgetTarget img = new AppWidgetTarget(context, R.id.img, views, appWidgetId) {
                @Override
                public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                    super.onResourceReady(resource, transition);
                }
            };
            Glide.with(context.getApplicationContext()).asBitmap()
                    .load("http://android12.altervista.org/res/ic_call.png").apply(options).into(img);


            AppWidgetTarget img2 = new AppWidgetTarget(context, R.id.img2, views, appWidgetId) {
                @Override
                public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                    super.onResourceReady(resource, transition);
                }
            };
            Glide.with(context.getApplicationContext()).asBitmap()
                    .load("http://android12.altervista.org/res/ic_sms.png").apply(options).into(img2);


            AppWidgetTarget img3 = new AppWidgetTarget(context, R.id.img3, views, appWidgetId) {
                @Override
                public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                    super.onResourceReady(resource, transition);
                }
            };
            Glide.with(context.getApplicationContext()).asBitmap()
                    .load("http://android12.altervista.org/res/ic_mms.png").apply(options).into(img3);

            SharedPreferences settings = context.getSharedPreferences("sharedPreferences", 0);
            SharedPreferences.Editor editor = settings.edit();
            editor.apply();
            final String site_url = context.getString(R.string.site_url);
            String userid = settings.getString("userid", null);
            String password = settings.getString("password", null);


            if (password.length() == 0) {
                views.setViewVisibility(R.id.login, VISIBLE);
            } else {
                views.setViewVisibility(R.id.linearLayout, VISIBLE);
            }


            String url = (site_url + "?userid=" + userid + "&password=" + password + "&token=" + token).replaceAll("\\s+", "");
            RequestQueue login = Volley.newRequestQueue(context);
            JsonObjectRequest getRequestLogin = new JsonObjectRequest(Request.Method.GET, url, null,
                    response -> {


                        try {
                            JSONObject json_raw = new JSONObject(response.toString());
                            String iliad = json_raw.getString("iliad");
                            JSONObject json = new JSONObject(iliad);

                            String stringUser_numtell = json.getString("user_numtell");
                            views.setTextViewText(R.id.user_numtell, stringUser_numtell.replace("Numero: ", ""));

                        } catch (JSONException ignored) {
                        }


                        Intent intent1 = new Intent(context, Widget.class);
                        intent1.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                        intent1.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
                        context.sendBroadcast(intent1);


                        String url1 = site_url + "?credit=true&token=" + token;
                        RequestQueue creditqueue = Volley.newRequestQueue(context);
                        JsonObjectRequest getRequestCredit = new JsonObjectRequest(Request.Method.GET, url1, null,
                                response1 -> {
                                    try {

                                        JSONObject json_raw = new JSONObject(response1.toString());
                                        String iliad = json_raw.getString("iliad");
                                        JSONObject json = new JSONObject(iliad);

                                        String stringCredit = json.getString("0");
                                        JSONObject json_Credit = new JSONObject(stringCredit);
                                        String credit = json_Credit.getString("0");
                                        views.setTextViewText(R.id.credit, credit.split("&")[0]);

                                        String stringCall = json.getString("1");
                                        JSONObject json_Call = new JSONObject(stringCall);
                                        String call = json_Call.getString("0");
                                        views.setTextViewText(R.id.call, call.replace("Chiamate: ", ""));

                                        String stringSms = json.getString("2");
                                        JSONObject json_Sms = new JSONObject(stringSms);
                                        String sms = json_Sms.getString("0");
                                        views.setTextViewText(R.id.sms, sms);

                                        String stringGb = json.getString("3");
                                        JSONObject json_Gb = new JSONObject(stringGb);
                                        String gb = json_Gb.getString("0");
                                        views.setTextViewText(R.id.gb, gb);

                                        String x = gb.split("/")[0].replace("GB","0").replace("MB","");
                                        String y = gb.split("/")[1];

                                        String a = x.substring(0, x.length() - 2);
                                        String b = y.substring(0, y.length() - 2)+"000";

                                        Double e = Double.parseDouble(a.replace(",","."));
                                        Double f = Double.parseDouble(b);

                                        Double ef = (e / (e + f)) * 100;
                                        int result1 = ef.intValue();

                                        views.setProgressBar(R.id.progressbar, 100,result1,false);

                                        String stringMms = json.getString("4");
                                        JSONObject json_Mms = new JSONObject(stringMms);
                                        String mms = json_Mms.getString("0");
                                        views.setTextViewText(R.id.mms, mms);

                                        appWidgetManager.updateAppWidget(appWidgetId, views);


                                    } catch (JSONException ignored) {
                                    }

                                }, error -> {
                        });
                        creditqueue.add(getRequestCredit);




                    }, error1 -> {
            });

            login.add(getRequestLogin);


            Intent intent1 = new Intent(context, Widget.class);
            intent1.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent1.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
            PendingIntent pendingIntent1 = PendingIntent.getBroadcast(context,
                    0, intent1, 0);


            views.setOnClickPendingIntent(R.id.button, pendingIntent1);

            appWidgetManager.updateAppWidget(appWidgetId, views);


        }

    }


}
