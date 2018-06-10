package com.fast0n.iliad.ConsumptionDetailsActivity;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fast0n.iliad.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class ConsumptionRoamingDetailActivity extends AppCompatActivity {

    ActionBar actionBar;
    Button requests;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_consumption_roaming_detail);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        TextView mTitle = toolbar.findViewById(R.id.toolbar_title);
        mTitle.setText(R.string.consumptionroamingdetail);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);

        // set row icon in the toolbar
        actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);

        final Bundle extras = getIntent().getExtras();
        assert extras != null;
        final String token = extras.getString("token", null);
        final String site_url = getString(R.string.site_url);


        // java adresses

        String url = site_url + "?consumptionroamingdetails=true&token=" + token;
        getConsumption(url);


    }

    private void getConsumption(String url) {

        RequestQueue queue = Volley.newRequestQueue(ConsumptionRoamingDetailActivity.this);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            JSONObject json_raw = new JSONObject(response.toString());
                            String iliad = json_raw.getString("iliad");


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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {
            case android.R.id.home:

                super.onBackPressed();

                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

}
