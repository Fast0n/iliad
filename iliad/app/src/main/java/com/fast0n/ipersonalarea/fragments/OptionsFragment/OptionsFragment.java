package com.fast0n.ipersonalarea.fragments.OptionsFragment;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fast0n.ipersonalarea.LoginActivity;
import com.fast0n.ipersonalarea.R;
import com.github.angads25.toggle.LabeledSwitch;
import com.github.angads25.toggle.interfaces.OnToggledListener;
import com.github.ybq.android.spinkit.style.CubeGrid;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

/**
 * A simple {@link Fragment} subclass.
 */
public class OptionsFragment extends Fragment {

    public OptionsFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        final View view = inflater.inflate(R.layout.fragment_options, container, false);

        final ProgressBar loading;
        final Context context;
        context = Objects.requireNonNull(getActivity()).getApplicationContext();
        CardView cardView;

        // java adresses
        loading = view.findViewById(R.id.progressBar);
        CubeGrid cubeGrid = new CubeGrid();
        loading.setIndeterminateDrawable(cubeGrid);
        cubeGrid.setColor(getResources().getColor(R.color.colorPrimary));
        cardView = view.findViewById(R.id.cardView);

        cardView.setVisibility(View.INVISIBLE);
        loading.setVisibility(View.VISIBLE);

        final Bundle extras = getActivity().getIntent().getExtras();
        assert extras != null;
        final String token = extras.getString("token");

        final String site_url = getString(R.string.site_url);
        String url = site_url + "?option=true&token=" + token;

        getObject(url, context, view);

        return view;
    }

    private void getObject(String url, final Context context, View view) {

        final ProgressBar loading;
        final RecyclerView recyclerView;
        final List<DataOptionsFragments> infoList = new ArrayList<>();
        final CardView cardView;
        final TextView credit;

        final Bundle extras = getActivity().getIntent().getExtras();
        assert extras != null;
        final String token = extras.getString("token");

        // java adresses
        recyclerView = view.findViewById(R.id.recycler_view);
        loading = view.findViewById(R.id.progressBar);
        cardView = view.findViewById(R.id.cardView);
        credit = view.findViewById(R.id.optionsText);

        recyclerView.setHasFixedSize(true);
        LinearLayoutManager llm = new LinearLayoutManager(context);
        llm.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(llm);

        RequestQueue queue = Volley.newRequestQueue(context);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            JSONObject json_raw = new JSONObject(response.toString());
                            String iliad = json_raw.getString("iliad");

                            JSONObject json = new JSONObject(iliad);

                            String string1 = json.getString("0");
                            JSONObject json_strings1 = new JSONObject(string1);
                            String stringCredit = json_strings1.getString("0");
                            credit.setText(stringCredit);

                            for (int i = 1; i < json.length(); i++) {

                                String string = json.getString(String.valueOf(i));
                                JSONObject json_strings = new JSONObject(string);

                                String a = json_strings.getString("0");
                                String b = json_strings.getString("2");
                                String c = json_strings.getString("3");
                                infoList.add(new DataOptionsFragments(a, b, c, i));

                            }

                            CustomAdapterOptions ca = new CustomAdapterOptions(context, infoList, token);
                            recyclerView.setAdapter(ca);
                            cardView.setVisibility(View.VISIBLE);
                            loading.setVisibility(View.INVISIBLE);

                        } catch (JSONException e) {
                            startActivity(new Intent(context, LoginActivity.class));
                        }
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        startActivity(new Intent(getActivity(), LoginActivity.class));

                    }
                });

        // add it to the RequestQueue
        queue.add(getRequest);

    }

}
