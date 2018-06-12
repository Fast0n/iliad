package com.fast0n.iliad.fragments.VoicemailFragment;

import android.app.Fragment;
import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.RecyclerView;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fast0n.iliad.R;


import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import es.dmoral.toasty.Toasty;


public class CustomAdapterVoicemail extends RecyclerView.Adapter<CustomAdapterVoicemail.MyViewHolder> {

    private List<DataVoicemailFragments> conditionList;
    private Context context;
    private MediaPlayer mediaPlayer;

    private boolean playPause;
    private boolean initialStage = true;

    CustomAdapterVoicemail(List<DataVoicemailFragments> conditionList, Context context) {
        this.conditionList = conditionList;
        this.context = context;
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        DataVoicemailFragments c = conditionList.get(position);



        holder.textView.setText(c.num_tell);
        holder.textView1.setText(Html.fromHtml(c.date));

        if (c.date.equals("")){
            holder.button.setVisibility(View.INVISIBLE);
            holder.button1.setVisibility(View.INVISIBLE);
        }

        holder.button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String site_url = context.getString(R.string.site_url);

                String url = site_url + "?deleteaudio=true&idaudio="+c.id+"&token="+c.token;



                RequestQueue queue = Volley.newRequestQueue(context);

                JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                        new Response.Listener<JSONObject>() {

                            @Override
                            public void onResponse(JSONObject response) {
                                try {

                                    JSONObject json_raw = new JSONObject(response.toString());
                                    String iliad = json_raw.getString("iliad");

                                    JSONObject json = new JSONObject(iliad);
                                    String string_json = json.getString("0");
                                    String string_json1 = json.getString("1");




                                    Toasty.success(context, string_json1, Toast.LENGTH_LONG,
                                            true).show();

                                } catch (JSONException ignored) {
                                }

                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                });

                queue.add(getRequest);
            }
        });


        holder.button1.setOnClickListener(new View.OnClickListener() {



            class Player extends AsyncTask<String, Void, Boolean> {
                @Override
                protected Boolean doInBackground(String... strings) {
                    Boolean prepared = false;

                    try {
                        mediaPlayer.setDataSource(strings[0]);
                        mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                            @Override
                            public void onCompletion(MediaPlayer mediaPlayer) {
                                initialStage = true;
                                playPause = false;
                                holder.button1.setBackgroundResource(R.drawable.ic_play);
                                mediaPlayer.stop();
                                mediaPlayer.reset();
                            }
                        });

                        mediaPlayer.prepare();
                        prepared = true;

                    } catch (Exception e) {
                        prepared = false;
                    }

                    return prepared;
                }


                @Override
                protected void onPostExecute(Boolean aBoolean) {
                    super.onPostExecute(aBoolean);


                    mediaPlayer.start();
                    initialStage = false;
                }

                @Override
                protected void onPreExecute() {
                    super.onPreExecute();

                }
            }

            @Override
            public void onClick(View v) {


                if (!playPause) {
                    holder.button1.setBackgroundResource(R.drawable.ic_pause);





                    if (initialStage) {

                        final String site_url = context.getString(R.string.site_url);
                        new Player().execute(site_url + "?idaudio="+c.id+"&token="+c.token);
                    } else {
                        if (!mediaPlayer.isPlaying())
                            mediaPlayer.start();
                    }

                    playPause = true;

                } else {
                    holder.button1.setBackgroundResource(R.drawable.ic_play);

                    if (mediaPlayer.isPlaying()) {
                        mediaPlayer.pause();

                    }



                    playPause = false;
                }

            }

        });



    }




    @Override
    public int getItemCount() {
        return conditionList.size();
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.row_voicemail, parent, false);
        return new MyViewHolder(v);
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        TextView textView, textView1;
        ImageButton button, button1;
        RecyclerView recyclerView;


        MyViewHolder(View view) {
            super(view);
            textView = view.findViewById(R.id.textView);
            textView1 = view.findViewById(R.id.textView1);
            button1 = view.findViewById(R.id.button1);
            button = view.findViewById(R.id.button);
            recyclerView = view.findViewById(R.id.recycler_view);

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);

        }
    }
}